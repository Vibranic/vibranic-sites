import type { TimeRange, Weekday } from '../types/site-config'

/**
 * Pure opening-hours logic. Takes a Date so it can be tested; never reads the clock itself.
 * All times are Europe/Brussels local time, whatever timezone the visitor's device is in.
 */
export type WeekHours = Record<Weekday, TimeRange[]>

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const JS_DAY_TO_WEEKDAY: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const SHORT_NAME_TO_WEEKDAY: Record<string, Weekday> = {
  Mon: 'mon', Tue: 'tue', Wed: 'wed', Thu: 'thu', Fri: 'fri', Sat: 'sat', Sun: 'sun',
}

export interface BrusselsMoment {
  /** 'YYYY-MM-DD' in Brussels */
  dateKey: string
  weekday: Weekday
  /** minutes since local midnight */
  minutes: number
}

export function getBrusselsMoment(date: Date): BrusselsMoment {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    weekday: SHORT_NAME_TO_WEEKDAY[get('weekday')] ?? 'mon',
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

export function toMinutes(time: string): number {
  const [h = '0', m = '0'] = time.split(':')
  return Number(h) * 60 + Number(m)
}

/** Calendar arithmetic on 'YYYY-MM-DD' (noon UTC avoids any DST edge). */
export function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function weekdayOf(dateKey: string): Weekday {
  return JS_DAY_TO_WEEKDAY[new Date(`${dateKey}T12:00:00Z`).getUTCDay()] ?? 'mon'
}

export function findClosure<T extends { from: string; to: string }>(
  closures: T[] | undefined,
  dateKey: string,
): T | undefined {
  return closures?.find((c) => dateKey >= c.from && dateKey <= c.to)
}

export type OpenStatus<C> =
  | { open: true; closesAt: string }
  | {
      open: false
      /** Set when today falls inside a closure period */
      closure?: C
      /** Next time the shop opens, if within the next 14 days */
      next?: { weekday: Weekday; time: string; dayOffset: number }
    }

export function getOpenStatus<C extends { from: string; to: string }>(
  hours: WeekHours,
  closures: C[] | undefined,
  now: Date,
): OpenStatus<C> {
  const moment = getBrusselsMoment(now)
  const todayClosure = findClosure(closures, moment.dateKey)

  if (!todayClosure) {
    for (const [open, close] of hours[moment.weekday]) {
      if (moment.minutes >= toMinutes(open) && moment.minutes < toMinutes(close)) {
        return { open: true, closesAt: close }
      }
    }
  }

  for (let offset = 0; offset <= 14; offset++) {
    const key = addDays(moment.dateKey, offset)
    if (findClosure(closures, key)) continue
    const weekday = weekdayOf(key)
    for (const [open] of hours[weekday]) {
      // Today only counts if the opening time is still ahead of us.
      if (offset === 0 && toMinutes(open) <= moment.minutes) continue
      return { open: false, closure: todayClosure, next: { weekday, time: open, dayOffset: offset } }
    }
  }
  return { open: false, closure: todayClosure }
}

/** Closures that haven't ended yet (by Brussels date), soonest first. */
export function upcomingClosures<C extends { from: string; to: string }>(closures: C[] | undefined, now: Date): C[] {
  const today = getBrusselsMoment(now).dateKey
  return (closures ?? []).filter((c) => c.to >= today).sort((a, b) => a.from.localeCompare(b.from))
}

/** [['09:00','12:30'],['13:30','18:00']] → '09:00–12:30 · 13:30–18:00'. Empty = '' (caller shows "Gesloten"). */
export function formatRanges(ranges: TimeRange[]): string {
  return ranges.map(([open, close]) => `${open}–${close}`).join(' · ')
}
