export type SupportedLocale = 'en' | 'ru'

type Messages = {
  addParking: string
  additionalServices: string
  allComplaints: string
  allReviews: string
  anonymousUser: string
  capacity: string
  complaints: string
  close: string
  delete: string
  details: string
  edit: string
  info: string
  loading: string
  loadingComplaints: string
  loadingPhotos: string
  loadingReviews: string
  noAddress: string
  noComplaints: string
  noParkings: string
  noPhoto: string
  noPhotos: string
  noReviews: string
  parkingList: string
  photo: string
  readLess: string
  readMore: string
  reviews: string
  search: string
  spots: string
  unableToLoadParkingList: string
}

const messagesByLocale: Record<SupportedLocale, Messages> = {
  en: {
    addParking: 'Add parking',
    additionalServices: 'Additional services',
    allComplaints: 'All complaints',
    allReviews: 'All reviews',
    anonymousUser: 'Deleted user',
    capacity: 'Capacity',
    complaints: 'Complaints',
    close: 'Close',
    delete: 'Delete',
    details: 'More detailed',
    edit: 'Edit',
    info: 'Info',
    loading: 'Loading...',
    loadingComplaints: 'Loading complaints...',
    loadingPhotos: 'Loading photos...',
    loadingReviews: 'Loading reviews...',
    noAddress: 'No address',
    noComplaints: 'No complaints for this parking yet.',
    noParkings: 'No parkings found.',
    noPhoto: 'No photo',
    noPhotos: 'No photos for this parking yet.',
    noReviews: 'No reviews for this parking yet.',
    parkingList: 'Parking list',
    photo: 'Photo',
    readLess: 'Read less',
    readMore: 'Read more',
    reviews: 'Reviews',
    search: 'Search',
    spots: 'spots',
    unableToLoadParkingList: 'Unable to load parking list.',
  },
  ru: {
    addParking: 'Добавить парковку',
    additionalServices: 'Дополнительные услуги',
    allComplaints: 'Все жалобы',
    allReviews: 'Все отзывы',
    anonymousUser: 'Удаленный пользователь',
    capacity: 'Вместимость',
    complaints: 'Жалобы',
    close: 'Закрыть',
    delete: 'Удалить',
    details: 'Подробнее',
    edit: 'Редактировать',
    info: 'Инфо',
    loading: 'Загрузка...',
    loadingComplaints: 'Загружаем жалобы...',
    loadingPhotos: 'Загружаем фотографии...',
    loadingReviews: 'Загружаем отзывы...',
    noAddress: 'Нет адреса',
    noComplaints: 'Для этой парковки пока нет жалоб.',
    noParkings: 'Парковки не найдены.',
    noPhoto: 'Нет фото',
    noPhotos: 'У этой парковки пока нет фотографий.',
    noReviews: 'Для этой парковки пока нет отзывов.',
    parkingList: 'Список парковок',
    photo: 'Фото',
    readLess: 'Свернуть',
    readMore: 'Читать дальше',
    reviews: 'Отзывы',
    search: 'Поиск',
    spots: 'мест',
    unableToLoadParkingList: 'Не удалось загрузить список парковок.',
  },
}

function getRussianPlural(count: number, one: string, few: string, many: string) {
  const normalizedCount = Math.abs(count) % 100
  const lastDigit = normalizedCount % 10

  if (normalizedCount > 10 && normalizedCount < 20) {
    return many
  }

  if (lastDigit > 1 && lastDigit < 5) {
    return few
  }

  if (lastDigit === 1) {
    return one
  }

  return many
}

export function getParkingMessages(locale: SupportedLocale) {
  return messagesByLocale[locale]
}

export function formatReviewCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, 'отзыв', 'отзыва', 'отзывов')}`
  }

  return `${count} review${count === 1 ? '' : 's'}`
}

export function formatComplaintCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, 'жалоба', 'жалобы', 'жалоб')}`
  }

  return `${count} complaint${count === 1 ? '' : 's'}`
}

export function formatSpotsCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, 'место', 'места', 'мест')}`
  }

  return `${count} spot${count === 1 ? '' : 's'}`
}
