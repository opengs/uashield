export function getDateTimeString (date?: Date): string {
  const rawDate = date || new Date()
  const nowDate = rawDate.toLocaleDateString('en-CA')
  const nowTime = rawDate.toLocaleTimeString()
  return `${nowDate} ${nowTime}`
}
