import { useMemo } from 'react'
import type { SupportedLocale } from '../constants/parkingI18n'

function resolveSystemLocale() {
  if (typeof navigator === 'undefined') {
    return 'en' as SupportedLocale
  }

  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export function useSystemLocale() {
  return useMemo(() => resolveSystemLocale(), [])
}
