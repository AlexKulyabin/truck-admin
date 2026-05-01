import type { Locale } from './authTypes'

export function getAuthLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'ru'
  }

  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}
