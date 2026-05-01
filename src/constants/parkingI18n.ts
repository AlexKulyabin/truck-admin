export type SupportedLocale = 'en' | 'ru'

type Messages = {
  addParking: string
  addingParking: string
  additionalServices: string
  allComplaints: string
  allReviews: string
  anonymousUser: string
  capacity: string
  close: string
  complaints: string
  delete: string
  details: string
  edit: string
  editingParking: string
  enterAddress: string
  gasStation: string
  hotel: string
  info: string
  laundry: string
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
  ok: string
  parkingList: string
  parkingAddedDescription: string
  parkingAddedTitle: string
  parkingUpdatedDescription: string
  parkingUpdatedTitle: string
  photo: string
  readLess: string
  readMore: string
  recreationArea: string
  reviews: string
  search: string
  saveChanges: string
  shop: string
  shower: string
  spots: string
  upTo: string
  unableToLoadParkingList: string
  unableToSaveParking: string
  unableToUpdateParking: string
}

const messagesByLocale: Record<SupportedLocale, Messages> = {
  en: {
    addParking: 'Add parking',
    addingParking: 'Adding parking',
    additionalServices: 'Additional services',
    allComplaints: 'All complaints',
    allReviews: 'All reviews',
    anonymousUser: 'Deleted user',
    capacity: 'Capacity',
    close: 'Close',
    complaints: 'Complaints',
    delete: 'Delete',
    details: 'More detailed',
    edit: 'Edit',
    editingParking: 'Editing parking',
    enterAddress: 'Enter address',
    gasStation: 'Gas station',
    hotel: 'Hotel',
    info: 'Info',
    laundry: 'Laundry',
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
    ok: 'OK',
    parkingList: 'Parking list',
    parkingAddedDescription: 'Parking has been added and will be displayed on the map',
    parkingAddedTitle: 'Parking added',
    parkingUpdatedDescription: 'Parking changes have been saved and will be displayed on the map',
    parkingUpdatedTitle: 'Parking updated',
    photo: 'Photo',
    readLess: 'Read less',
    readMore: 'Read more',
    recreationArea: 'Recreation area',
    reviews: 'Reviews',
    search: 'Search',
    saveChanges: 'Save changes',
    shop: 'Shop',
    shower: 'Shower',
    spots: 'spots',
    upTo: 'Up to',
    unableToLoadParkingList: 'Unable to load parking list.',
    unableToSaveParking: 'Unable to save parking. Please try again.',
    unableToUpdateParking: 'Unable to update parking. Please try again.',
  },
  ru: {
    addParking: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443',
    addingParking: '\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438',
    additionalServices: '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0443\u0441\u043b\u0443\u0433\u0438',
    allComplaints: '\u0412\u0441\u0435 \u0436\u0430\u043b\u043e\u0431\u044b',
    allReviews: '\u0412\u0441\u0435 \u043e\u0442\u0437\u044b\u0432\u044b',
    anonymousUser: '\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c',
    capacity: '\u0412\u043c\u0435\u0441\u0442\u0438\u043c\u043e\u0441\u0442\u044c',
    close: '\u0417\u0430\u043a\u0440\u044b\u0442\u044c',
    complaints: '\u0416\u0430\u043b\u043e\u0431\u044b',
    delete: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c',
    details: '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435',
    edit: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c',
    editingParking: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438',
    enterAddress: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441',
    gasStation: '\u0417\u0430\u043f\u0440\u0430\u0432\u043a\u0430',
    hotel: '\u041e\u0442\u0435\u043b\u044c',
    info: '\u0418\u043d\u0444\u043e',
    laundry: '\u041f\u0440\u0430\u0447\u0435\u0447\u043d\u0430\u044f',
    loading: '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...',
    loadingComplaints: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0436\u0430\u043b\u043e\u0431\u044b...',
    loadingPhotos: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0438...',
    loadingReviews: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043e\u0442\u0437\u044b\u0432\u044b...',
    noAddress: '\u041d\u0435\u0442 \u0430\u0434\u0440\u0435\u0441\u0430',
    noComplaints: '\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0436\u0430\u043b\u043e\u0431.',
    noParkings: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.',
    noPhoto: '\u041d\u0435\u0442 \u0444\u043e\u0442\u043e',
    noPhotos: '\u0423 \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0439.',
    noReviews: '\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043e\u0442\u0437\u044b\u0432\u043e\u0432.',
    ok: 'OK',
    parkingList: '\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u0430\u0440\u043a\u043e\u0432\u043e\u043a',
    parkingAddedDescription: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430 \u0438 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
    parkingAddedTitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430',
    parkingUpdatedDescription: '\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b \u0438 \u0431\u0443\u0434\u0443\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
    parkingUpdatedTitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0431\u044b\u043b\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0430',
    photo: '\u0424\u043e\u0442\u043e',
    readLess: '\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c',
    readMore: '\u0427\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043b\u044c\u0448\u0435',
    recreationArea: '\u0417\u043e\u043d\u0430 \u043e\u0442\u0434\u044b\u0445\u0430',
    reviews: '\u041e\u0442\u0437\u044b\u0432\u044b',
    search: '\u041f\u043e\u0438\u0441\u043a',
    saveChanges: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f',
    shop: '\u041c\u0430\u0433\u0430\u0437\u0438\u043d',
    shower: '\u0414\u0443\u0448',
    spots: '\u043c\u0435\u0441\u0442',
    upTo: '\u0414\u043e',
    unableToLoadParkingList: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u0430\u0440\u043a\u043e\u0432\u043e\u043a.',
    unableToSaveParking: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
    unableToUpdateParking: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
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
    return `${count} ${getRussianPlural(count, '\u043e\u0442\u0437\u044b\u0432', '\u043e\u0442\u0437\u044b\u0432\u0430', '\u043e\u0442\u0437\u044b\u0432\u043e\u0432')}`
  }

  return `${count} review${count === 1 ? '' : 's'}`
}

export function formatComplaintCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, '\u0436\u0430\u043b\u043e\u0431\u0430', '\u0436\u0430\u043b\u043e\u0431\u044b', '\u0436\u0430\u043b\u043e\u0431')}`
  }

  return `${count} complaint${count === 1 ? '' : 's'}`
}

export function formatSpotsCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, '\u043c\u0435\u0441\u0442\u043e', '\u043c\u0435\u0441\u0442\u0430', '\u043c\u0435\u0441\u0442')}`
  }

  return `${count} spot${count === 1 ? '' : 's'}`
}
