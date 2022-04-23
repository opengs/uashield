import dayjs from 'dayjs'
import { EnumRandomGenerator, StringRandomGenerator, IntegerRandomGenerator, DateRandomGenerator } from '../../external/targetsPool'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function getEnumRandomValue (generator: EnumRandomGenerator): string {
  if (Array.isArray(generator.values) && generator.values.length > 0) {
    const value = generator.values[Math.floor(Math.random() * generator.values.length)]
    return String(value).toString()
  }
  return ''
}

export function getStringRandomValue (generator: StringRandomGenerator): string {
  let length = generator.length
  if (length === undefined || length <= 0) {
    const minLength = (generator.minLength !== undefined && !isNaN(generator.minLength)) ? generator.minLength : 1
    const maxLength = (generator.maxLength !== undefined && !isNaN(generator.maxLength)) ? generator.maxLength : 256
    if (minLength <= maxLength) {
      length = Math.floor(Math.random() * (maxLength - minLength)) + minLength
    } else {
      length = maxLength
    }
  }
  length = Math.max(1, Math.min(256, length))

  return [...Array<string>(length)].map(() => CHARSET[Math.floor(Math.random() * CHARSET.length)]).join('')
}

export function getIntegerRandomString (generator: IntegerRandomGenerator): string {
  const minValue = (generator.minValue !== undefined && !isNaN(generator.minValue)) ? generator.minValue : 0
  const maxValue = (generator.maxValue !== undefined && !isNaN(generator.maxValue)) ? generator.maxValue : 1000000
  const value = Math.floor(Math.random() * (maxValue - minValue)) + minValue
  return value.toString()
}

export function getDateRandomString (generator: DateRandomGenerator): string {
  const start = (generator.minValue !== undefined && !isNaN(Date.parse(generator.minValue))) ? new Date(generator.minValue) : new Date(1900, 1, 1)
  let end = (generator.maxValue !== undefined && !isNaN(Date.parse(generator.maxValue))) ? new Date(generator.maxValue) : new Date()
  if (end < start) {
    end = start
  }
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return dayjs(randomDate).format(generator.format)
}

export function getRandomValue (generator: StringRandomGenerator | IntegerRandomGenerator | DateRandomGenerator | EnumRandomGenerator): string {
  switch (generator.type) {
    case 'enum': return getEnumRandomValue(generator)
    case 'string': return getStringRandomValue(generator)
    case 'integer': return getIntegerRandomString(generator)
    case 'date': return getDateRandomString(generator)
  }
  return ''
}
