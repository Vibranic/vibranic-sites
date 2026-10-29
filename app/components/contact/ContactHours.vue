<script setup lang="ts">
import {
  WEEKDAYS,
  formatRanges,
  getBrusselsMoment,
  getOpenStatus,
  upcomingClosures,
  type OpenStatus,
} from '~/utils/openingHours'

const { site, t } = useSite()
const { ui, fill, formatDate } = useUi()
const { hoursNote, closures } = site.contact
// SectionContact only renders this block when the config has opening hours.
const hours = site.contact.hours!

// Time-dependent things are computed ONLY after mount: the page is built once as static
// HTML, so anything computed at build time would be stale the moment it is published.
type Closure = NonNullable<typeof closures>[number]
const status = ref<OpenStatus<Closure> | null>(null)
const today = ref<string | null>(null)
const nextClosures = ref<Closure[]>([])

function refresh() {
  const now = new Date()
  status.value = getOpenStatus(hours, closures, now)
  today.value = getBrusselsMoment(now).weekday
  nextClosures.value = upcomingClosures(closures, now)
}

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  refresh()
  timer = setInterval(refresh, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const badgeText = computed(() => {
  const s = status.value
  if (!s) return ''
  if (s.open) return fill(ui.value.hours.openUntil, { time: s.closesAt })
  if (!s.next) return ui.value.hours.closedOnly
  const when =
    s.next.dayOffset === 0
      ? ui.value.hours.todayWord
      : s.next.dayOffset === 1
        ? ui.value.hours.tomorrowWord
        : ui.value.days[s.next.weekday].long
  const template = s.closure ? ui.value.hours.closedClosure : ui.value.hours.closedOpens
  return fill(template, { when, time: s.next.time, label: s.closure ? t(s.closure.label) : '' })
})

const closureText = (c: Closure) =>
  c.from === c.to
    ? fill(ui.value.hours.closureSingle, { from: formatDate(c.from) })
    : fill(ui.value.hours.closureRange, { from: formatDate(c.from, false), to: formatDate(c.to) })
</script>

<template>
  <div class="hours stack" style="--stack-gap: var(--space-4)">
    <h3 class="h3">{{ ui.hours.title }}</h3>

    <!-- Reserved height so the badge popping in after mount doesn't shift the layout. -->
    <div class="hours__status">
      <p v-if="status" class="badge" :class="{ 'badge--accent': status.open }" role="status">
        {{ badgeText }}
      </p>
    </div>

    <table class="hours__table">
      <caption class="sr-only">{{ ui.hours.title }}</caption>
      <tbody>
        <tr
          v-for="day in WEEKDAYS"
          :key="day"
          :class="{ 'hours__row--today': today === day }"
          :aria-current="today === day ? 'date' : undefined"
        >
          <th scope="row">
            {{ ui.days[day].long }}
            <span v-if="today === day" class="sr-only"> ({{ ui.hours.today }})</span>
          </th>
          <td>
            <!-- One range per line (lunch break = two lines), so it never wraps mid-time on phones. -->
            <span v-for="(range, i) in hours[day]" :key="i" class="hours__range">{{ formatRanges([range]) }}</span>
            <template v-if="!hours[day].length">{{ ui.hours.closed }}</template>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="hoursNote" class="muted">{{ t(hoursNote) }}</p>

    <div v-if="nextClosures.length" class="hours__closures">
      <p class="hours__closures-title">{{ ui.hours.closuresTitle }}</p>
      <ul role="list">
        <li v-for="closure in nextClosures" :key="closure.from">
          {{ t(closure.label) }}: {{ closureText(closure) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.hours__status { min-height: calc(var(--space-5) + var(--space-2)); }

.hours__table {
  width: 100%;
  border-collapse: collapse;
}
.hours__table th,
.hours__table td {
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--border-width) solid var(--color-border);
  text-align: left;
  vertical-align: top;
}
.hours__table th {
  font-weight: var(--font-body-weight);
  text-transform: capitalize;
}
.hours__table td { text-align: right; font-variant-numeric: tabular-nums; }
.hours__range { display: block; white-space: nowrap; }

/* Today's row: tint + bold + an accent bar (not color alone). */
.hours__row--today th,
.hours__row--today td {
  background-color: var(--color-highlight);
  font-weight: var(--font-body-weight-strong);
}
.hours__row--today th { box-shadow: inset var(--space-1) 0 0 var(--color-accent); }

.hours__closures-title { font-weight: var(--font-body-weight-strong); }
.hours__closures ul { margin: 0; padding: 0; list-style: none; color: var(--color-text-muted); }
</style>
