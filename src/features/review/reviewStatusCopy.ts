import type { Locale, ReviewStatus } from '../auth/authTypes'

type ReviewStatusCopy = {
  action?: string
  description: string
  title: string
}

export const reviewStatusCopy: Record<
  Locale,
  Record<ReviewStatus, ReviewStatusCopy>
> = {
  ru: {
    pending: {
      title: 'Данные на проверке',
      description: 'Ожидайте решение администратора',
    },
    approved: {
      title: 'Профиль подтвержден',
      description: '',
      action: 'Начать работу',
    },
    rejected: {
      title: 'Профиль не подтвержден',
      description: 'Попробуйте зарегистрироваться снова',
      action: 'Зарегистрироваться',
    },
  },
  en: {
    pending: {
      title: 'Data under review',
      description: 'Please wait for the administrator decision',
    },
    approved: {
      title: 'Profile approved',
      description: '',
      action: 'Start working',
    },
    rejected: {
      title: 'Profile not approved',
      description: 'Try registering again',
      action: 'Register',
    },
  },
}
