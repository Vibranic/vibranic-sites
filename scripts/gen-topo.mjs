/**
 * Generates the topographic texture used by `.texture-topo` (signature.css).
 *
 *   node scripts/gen-topo.mjs            → public/images/kit/textures/topo-wide.svg + topo-tall.svg
 *   node scripts/gen-topo.mjs 42         → same, with another seed (a different map)
 *
 * Each file is ONE contour map (no tiling, no mirroring): a smooth noise field turned into
 * contour lines with marching squares. Two shapes so the rings keep a similar on-screen size:
 *   wide (2400×1200) for landscape sections, tall (1000×2000) for phones. Both are used with
 *   `mask-size: cover`, so at scale ≈ 0.4–1 the rings stay ~150–400px wide on every screen.
 * Tweak FEATURE (ring size, px in the SVG) and LEVELS (line density) below.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const seed = Number(process.argv[2] ?? 7)
const FEATURE = 520 // size of the biggest hills/valleys, in SVG px
const LEVELS = 13 // contour lines
const STEP = 16 // grid step in SVG px (smaller = smoother, bigger file)
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/images/kit/textures')

function rng(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth value noise on a lattice, summed over 3 octaves. */
function makeField(w, h, seedValue) {
  const rand = rng(seedValue)
  const octaves = [1, 2, 4].map((f, i) => {
    const cell = FEATURE / f
    const cols = Math.ceil(w / cell) + 3
    const rows = Math.ceil(h / cell) + 3
    const lattice = Array.from({ length: cols * rows }, () => rand())
    return { cell, cols, amp: 1 / 2 ** i, lattice }
  })
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    let sum = 0
    for (const { cell, cols, amp, lattice } of octaves) {
      const gx = x / cell + 1
      const gy = y / cell + 1
      const x0 = Math.floor(gx), y0 = Math.floor(gy)
      const tx = smooth(gx - x0), ty = smooth(gy - y0)
      const at = (i, j) => lattice[j * cols + i]
      const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx
      const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx
      sum += (top * (1 - ty) + bottom * ty) * amp
    }
    return sum
  }
}

function contours(w, h, field, levelCount) {
  const cols = Math.floor(w / STEP) + 1
  const rows = Math.floor(h / STEP) + 1
  const v = new Float32Array(cols * rows)
  let min = Infinity, max = -Infinity
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const value = field(i * STEP, j * STEP)
      v[j * cols + i] = value
      if (value < min) min = value
      if (value > max) max = value
    }
  const paths = []
  for (let k = 1; k <= levelCount; k++) {
    const level = min + ((max - min) * k) / (levelCount + 1)
    // Edge ids: horizontal edge (i,j) = between corner (i,j)-(i+1,j); vertical (i,j) = (i,j)-(i,j+1).
    const pointOf = new Map()
    const edgePoint = (kind, i, j) => {
      const id = `${kind}${i},${j}`
      if (!pointOf.has(id)) {
        const a = v[j * cols + i]
        const b = kind === 'h' ? v[j * cols + i + 1] : v[(j + 1) * cols + i]
        const t = (level - a) / (b - a)
        pointOf.set(id, kind === 'h' ? [(i + t) * STEP, j * STEP] : [i * STEP, (j + t) * STEP])
      }
      return id
    }
    const links = new Map()
    const link = (a, b) => {
      if (!links.has(a)) links.set(a, [])
      if (!links.has(b)) links.set(b, [])
      links.get(a).push(b)
      links.get(b).push(a)
    }
    for (let j = 0; j < rows - 1; j++)
      for (let i = 0; i < cols - 1; i++) {
        const tl = v[j * cols + i] > level, tr = v[j * cols + i + 1] > level
        const br = v[(j + 1) * cols + i + 1] > level, bl = v[(j + 1) * cols + i] > level
        const code = (tl ? 8 : 0) | (tr ? 4 : 0) | (br ? 2 : 0) | (bl ? 1 : 0)
        if (code === 0 || code === 15) continue
        const T = () => edgePoint('h', i, j), B = () => edgePoint('h', i, j + 1)
        const L = () => edgePoint('v', i, j), R = () => edgePoint('v', i + 1, j)
        const centreHigh = (v[j * cols + i] + v[j * cols + i + 1] + v[(j + 1) * cols + i] + v[(j + 1) * cols + i + 1]) / 4 > level
        const segs = {
          1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[T, R]], 6: [[T, B]], 7: [[L, T]],
          8: [[L, T]], 9: [[T, B]], 11: [[T, R]], 12: [[L, R]], 13: [[B, R]], 14: [[L, B]],
          5: centreHigh ? [[L, T], [B, R]] : [[L, B], [T, R]],
          10: centreHigh ? [[L, B], [T, R]] : [[L, T], [B, R]],
        }[code]
        for (const [a, b] of segs) link(a(), b())
      }
    // Chain the segments into polylines (open ones first, then closed loops).
    const seen = new Set()
    const walk = (start) => {
      const line = [start]
      seen.add(start)
      let current = start
      for (;;) {
        const next = links.get(current).find((n) => !seen.has(n))
        if (!next) break
        seen.add(next)
        line.push(next)
        current = next
      }
      const closed = line.length > 2 && links.get(current).includes(start)
      return { points: line.map((id) => pointOf.get(id)), closed }
    }
    const ids = [...links.keys()]
    for (const id of ids) if (!seen.has(id) && links.get(id).length === 1) paths.push(walk(id))
    for (const id of ids) if (!seen.has(id)) paths.push(walk(id))
  }
  return paths
}

/** Quadratic smoothing through the midpoints: compact and round, no polygon corners. */
function toPath({ points, closed }) {
  const f = (n) => Math.round(n * 10) / 10
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const n = points.length
  if (n < 3) return ''
  let d = ''
  if (closed) {
    const m = mid(points[n - 1], points[0])
    d = `M${f(m[0])} ${f(m[1])}`
    for (let i = 0; i < n; i++) {
      const p = points[i], m2 = mid(p, points[(i + 1) % n])
      d += `Q${f(p[0])} ${f(p[1])} ${f(m2[0])} ${f(m2[1])}`
    }
    return d + 'Z'
  }
  d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 1; i < n - 1; i++) {
    const m2 = mid(points[i], points[i + 1])
    d += `Q${f(points[i][0])} ${f(points[i][1])} ${f(m2[0])} ${f(m2[1])}`
  }
  return d + `L${f(points[n - 1][0])} ${f(points[n - 1][1])}`
}

function build(name, w, h, seedValue) {
  const paths = contours(w, h, makeField(w, h, seedValue), LEVELS).map(toPath).filter(Boolean)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round"><path d="${paths.join('')}"/></svg>`
  mkdirSync(OUT, { recursive: true })
  writeFileSync(resolve(OUT, name), svg)
  console.log(`${name}: ${paths.length} lines, ${(svg.length / 1024).toFixed(0)} KB`)
}

build('topo-wide.svg', 2400, 1200, seed)
build('topo-tall.svg', 1000, 2000, seed + 1)
