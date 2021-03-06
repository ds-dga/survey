import dayjs from "dayjs"
import calendar from "dayjs/plugin/calendar"
import buddhistEra from "dayjs/plugin/buddhistEra"
import th from "dayjs/locale/th"

dayjs.extend(calendar)
dayjs.extend(buddhistEra)
dayjs.locale(th)

export const bkkTime = (dayStr) => dayjs(dayStr).calendar()
export const displayTime = (dayStr) => dayjs(dayStr).format("HH:mm")
export const relativeTime = (dayStr) => {
  const now = dayjs()
  const target = dayjs(dayStr)
  const diff = (target - now) / 1000
  if (diff < 0) {
    return "Passed"
  }
  const min = diff / 60
  if (min <= 60) {
    return `${min.toFixed(0)} min`
  }
  const hr = Math.floor(min / 60)
  const leftoverMin = Math.floor(min % 60)
  const minText = leftoverMin > 9 ? leftoverMin : `0${leftoverMin.toFixed(0)}`
  return `${hr.toFixed(0)}:${minText} hr`
}
export const displayDatetime = (dayStr) =>
  dayjs(dayStr).format("D MMM BBBB H:mm")
export const displayDate = (dayStr) => dayjs(dayStr).format("D MMM BBBB")

export const minDuration = (d1, d2) => {
  const diff = (dayjs(d2) - dayjs(d1)) / 1000
  return Math.floor(diff / 60) // min
}
export const getToday = () =>
  dayjs().subtract(3, "hour").format("YYYY-MM-DDTHH:mm:ssZ")

export const getEndOfLastMonth = () => {
  return dayjs().date(1).subtract(1, "day")
}
