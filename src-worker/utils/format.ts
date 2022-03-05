import { getDateTimeString } from './date'

type StringLike = string | number;

export function formatLog (...parts: StringLike[]): string {
  return `${getDateTimeString()} | ${parts.join(' | ')}`
}
