export const set = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const get = (key: string, defaultValue: string) => {
  return localStorage.getItem(key) ?? defaultValue
}

const SAVED_LANGUAGE_KEY = 'SAVED_LANGUAGE_KEY'

export const setSavedLanguage = (value: string) => {
  return set(SAVED_LANGUAGE_KEY, value)
}

export const getSavedLanguage = (defaultValue: string) => {
  return get(SAVED_LANGUAGE_KEY, defaultValue)
}
