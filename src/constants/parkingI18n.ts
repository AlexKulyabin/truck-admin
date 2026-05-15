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
  clearSearch: string
  complaints: string
  approve: string
  delete: string
  deleteParkingDialogCancel: string
  deleteParkingDialogConfirm: string
  deleteParkingDialogSubtitle: string
  deleteParkingDialogTitle: string
  deleteComplaintDialogCancel: string
  deleteComplaintDialogConfirm: string
  deleteComplaintDialogSubtitle: string
  deleteComplaintDialogTitle: string
  deleteReviewDialogCancel: string
  deleteReviewDialogConfirm: string
  deleteReviewDialogSubtitle: string
  deleteReviewDialogTitle: string
  unableToDeleteReview: string
  details: string
  edit: string
  editingParking: string
  enterAddress: string
  comment: string
  gasStation: string
  hotel: string
  info: string
  laundry: string
  loading: string
  googleMapsKeyInstructions: string
  googleMapsKeyNotConfigured: string
  loadingComplaints: string
  loadingPhotos: string
  loadingReviews: string
  loggingOut: string
  mainImpression: string
  accepted: string
  new: string
  approvalDialogTitle: string
  approvalDialogSubtitle: string
  great: string
  convenienceOfTruckArrival: string
  veryConvenient: string
  securityLevel: string
  absolutelySafe: string
  infrastructure: string
  everythingThatWasStatedInTheDescription: string
  comfortForRelaxation: string
  quietAndComfortable: string
  terribly: string
  badly: string
  medium: string
  normally: string
  difficult: string
  dangerous: string
  good: string
  quietly: string
  almostNothingIsAvailable: string
  onlyHalfOfTheServicesAreAvailable: string
  almostEverythingThatWasStated: string
  nothingButParking: string
  veryInconvenient: string
  inconvenient: string
  rejectRequest: string
  approveRequest: string
  unableToUpdateStatus: string
  rejected: string
  rejectDialogTitle: string
  rejectDialogSubtitle: string
  rejectDialogDone: string
  rejectionReasonDuplicate: string
  rejectionReasonIncompleteData: string
  rejectionReasonNotMeetingRequirements: string
  requests: string
  noAddress: string
  noComplaints: string
  noParkings: string
  noRequests: string
  noPhoto: string
  noPhotos: string
  noComment: string
  noReviews: string
  noReviewParkings: string
  noProfileReviews: string
  noProfileComplaints: string
  parkingDoesNotExist: string
  ok: string
  parkingList: string
  parkingAddedDescription: string
  parkingAddedTitle: string
  parkingUpdatedDescription: string
  parkingUpdatedTitle: string
  photo: string
  logout: string
  logoutDialogCancel: string
  logoutDialogConfirm: string
  logoutDialogTitle: string
  mainNavigation: string
  readLess: string
  readMore: string
  recreationArea: string
  reviews: string
  search: string
  saveChanges: string
  shop: string
  shower: string
  specifyReasonForComplaint: string
  spots: string
  upTo: string
  unableToDeleteParking: string
  unableToDeleteComplaint: string
  unableToLoadReviewParkings: string
  unableToLoadParkingList: string
  unableToSaveParking: string
  unableToUpdateParking: string
  unableToLogout: string
}

const messagesByLocale: Record<SupportedLocale, Messages> = {
  en: {
    addParking: 'Add parking',
    addingParking: 'Adding parking',
    approve: 'Approve',
    additionalServices: 'Additional services',
    allComplaints: 'All complaints',
    allReviews: 'All reviews',
    anonymousUser: 'Deleted user',
    capacity: 'Capacity',
    close: 'Close',
    clearSearch: 'Clear search',
    complaints: 'Complaints',
    delete: 'Delete',
    deleteParkingDialogCancel: 'Cancel',
    deleteParkingDialogConfirm: 'Delete',
    deleteParkingDialogSubtitle: 'The parking will be deleted and will not be displayed on the map',
    deleteParkingDialogTitle: 'Delete parking?',
    deleteComplaintDialogCancel: 'Cancel',
    deleteComplaintDialogConfirm: 'Delete',
    deleteComplaintDialogSubtitle: 'The complaint will be deleted and will not be displayed in the feed',
    deleteComplaintDialogTitle: 'Delete complaint?',
    deleteReviewDialogCancel: 'Cancel',
    deleteReviewDialogConfirm: 'Delete',
    deleteReviewDialogSubtitle: 'The review will be deleted and will not be displayed in the feed',
    deleteReviewDialogTitle: 'Delete review?',
    unableToDeleteReview: 'Unable to delete review. Please try again.',
    details: 'More details',
    edit: 'Edit',
    editingParking: 'Editing parking',
    enterAddress: 'Enter address',
    comment: 'Comment',
    gasStation: 'Gas station',
    hotel: 'Hotel',
    info: 'Info',
    laundry: 'Laundry',
    loading: 'Loading...',
    googleMapsKeyInstructions:
      'Create a local .env file from .env.example and set VITE_GOOGLE_MAPS_API_KEY.',
    googleMapsKeyNotConfigured: 'Google Maps key is not configured',
    loadingComplaints: 'Loading complaints...',
    loadingPhotos: 'Loading photos...',
    loadingReviews: 'Loading reviews...',
    loggingOut: 'Logging out...',
    mainImpression: 'The main impression',
    accepted: 'Accepted',
    new: 'New',
    approvalDialogTitle: 'The request has been approved',
    approvalDialogSubtitle: 'Parking will be displayed on the map',
    great: 'Great',
    convenienceOfTruckArrival: 'Convenience of truck arrival',
    veryConvenient: 'Very convenient',
    securityLevel: 'Security level',
    absolutelySafe: 'Absolutely safe',
    infrastructure: 'Infrastructure',
    everythingThatWasStatedInTheDescription: 'Everything that was stated in the description',
    comfortForRelaxation: 'Comfort for relaxation',
    quietAndComfortable: 'Quiet and comfortable',
    terribly: 'Terribly',
    badly: 'Badly',
    medium: 'Medium',
    normally: 'Normally',
    difficult: 'Difficult',
    dangerous: 'Dangerous',
    good: 'Good',
    quietly: 'Quietly',
    almostNothingIsAvailable: 'Almost nothing is available',
    onlyHalfOfTheServicesAreAvailable: 'Only half of the services are available',
    almostEverythingThatWasStated: 'Almost everything that was stated',
    nothingButParking: 'Nothing but parking',
    veryInconvenient: 'Very inconvenient',
    inconvenient: 'Inconvenient',
    rejectRequest: 'Reject',
    approveRequest: 'Accept',
    unableToUpdateStatus: 'Unable to update status. Please try again.',
    rejected: 'Rejected',
    rejectDialogTitle: 'Reject',
    rejectDialogSubtitle: 'Specify the reason for the rejection',
    rejectDialogDone: 'Done',
    rejectionReasonDuplicate: 'Duplicate',
    rejectionReasonIncompleteData: 'Incomplete data',
    rejectionReasonNotMeetingRequirements: 'Does not meet the requirements of the service',
    requests: 'Requests',
  noAddress: 'No address',
  noComplaints: 'No complaints for this parking yet.',
  noParkings: 'No parkings found.',
  noRequests: 'No requests found.',
  noPhoto: 'No photo',
  noPhotos: 'No photos for this parking yet.',
  noComment: 'No comment',
  noReviews: 'No reviews for this parking yet.',
    noReviewParkings: 'No parkings with reviews or complaints found.',
    noProfileReviews: 'There are no reviews',
    noProfileComplaints: 'There are no complaints',
    parkingDoesNotExist: 'Parking does not exist',
    ok: 'OK',
    parkingList: 'Parking list',
    parkingAddedDescription: 'Parking has been added and will be displayed on the map',
    parkingAddedTitle: 'Parking added',
    parkingUpdatedDescription: 'Parking changes have been saved and will be displayed on the map',
    parkingUpdatedTitle: 'Parking updated',
    photo: 'Photo',
    logout: 'Log out',
    logoutDialogCancel: 'Cancel',
    logoutDialogConfirm: 'Log out',
    logoutDialogTitle: 'Are you sure you want to log out of your account?',
    mainNavigation: 'Main navigation',
    readLess: 'Read less',
    readMore: 'Read more',
    recreationArea: 'Recreation area',
    reviews: 'Reviews',
    search: 'Search',
    saveChanges: 'Save changes',
    shop: 'Shop',
    shower: 'Shower',
    specifyReasonForComplaint: 'Specify the reason for the complaint',
    spots: 'spots',
    upTo: 'Up to',
    unableToDeleteParking: 'Unable to delete parking. Please try again.',
    unableToDeleteComplaint: 'Unable to delete complaint. Please try again.',
    unableToLoadReviewParkings: 'Unable to load review parkings.',
    unableToLoadParkingList: 'Unable to load parking list.',
    unableToSaveParking: 'Unable to save parking. Please try again.',
    unableToUpdateParking: 'Unable to update parking. Please try again.',
    unableToLogout: 'Unable to log out. Please try again.',
  },
  ru: {
    addParking: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443',
    addingParking: '\u0414\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438',
    approve: '\u041e\u0434\u043e\u0431\u0440\u0438\u0442\u044c',
    additionalServices: '\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0443\u0441\u043b\u0443\u0433\u0438',
    allComplaints: '\u0412\u0441\u0435 \u0436\u0430\u043b\u043e\u0431\u044b',
    allReviews: '\u0412\u0441\u0435 \u043e\u0442\u0437\u044b\u0432\u044b',
    anonymousUser: '\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0439 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c',
    capacity: '\u0412\u043c\u0435\u0441\u0442\u0438\u043c\u043e\u0441\u0442\u044c',
    close: '\u0417\u0430\u043a\u0440\u044b\u0442\u044c',
    clearSearch: '\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u043f\u043e\u0438\u0441\u043a',
    complaints: '\u0416\u0430\u043b\u043e\u0431\u044b',
    delete: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c',
    deleteParkingDialogCancel: '\u041e\u0442\u043c\u0435\u043d\u0430',
    deleteParkingDialogConfirm: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c',
    deleteParkingDialogSubtitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u0430\u043b\u0435\u043d\u0430 \u0438 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
    deleteParkingDialogTitle: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443?',
    deleteComplaintDialogCancel: '\u041e\u0442\u043c\u0435\u043d\u0430',
    deleteComplaintDialogConfirm: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c',
    deleteComplaintDialogSubtitle: '\u0416\u0430\u043b\u043e\u0431\u0430 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u0430\u043b\u0435\u043d\u0430 \u0438 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u0432 \u043b\u0435\u043d\u0442\u0435',
    deleteComplaintDialogTitle: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0436\u0430\u043b\u043e\u0431\u0443?',
  deleteReviewDialogCancel: '\u041e\u0442\u043c\u0435\u043d\u0430',
  deleteReviewDialogConfirm: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c',
  deleteReviewDialogSubtitle: '\u041e\u0442\u0437\u044b\u0432 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u0430\u043b\u0435\u043d \u0438 \u043d\u0435 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u0432 \u043b\u0435\u043d\u0442\u0435',
  deleteReviewDialogTitle: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u0442\u0437\u044b\u0432?',
  unableToDeleteReview: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u0442\u0437\u044b\u0432. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
    details: '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435',
    edit: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c',
    editingParking: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438',
    enterAddress: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441',
    comment: '\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439',
    gasStation: '\u0417\u0430\u043f\u0440\u0430\u0432\u043a\u0430',
    hotel: '\u041e\u0442\u0435\u043b\u044c',
    info: '\u0418\u043d\u0444\u043e',
    laundry: '\u041f\u0440\u0430\u0447\u0435\u0447\u043d\u0430\u044f',
    loading: '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...',
    googleMapsKeyInstructions: '\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0444\u0430\u0439\u043b .env \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 .env.example \u0438 \u0443\u043a\u0430\u0436\u0438\u0442\u0435 VITE_GOOGLE_MAPS_API_KEY.',
    googleMapsKeyNotConfigured: '\u041a\u043b\u044e\u0447 Google Maps \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d.',
  loadingComplaints: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0436\u0430\u043b\u043e\u0431\u044b...',
  loadingPhotos: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0438...',
  loadingReviews: '\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043e\u0442\u0437\u044b\u0432\u044b...',
  loggingOut: '\u0412\u044b\u0445\u043e\u0434...',
  mainImpression: '\u041e\u0441\u043d\u043e\u0432\u043d\u043e\u0435 \u0432\u043f\u0435\u0447\u0430\u0442\u043b\u0435\u043d\u0438\u0435',
  accepted: '\u041f\u0440\u0438\u043d\u044f\u0442\u044b\u0435',
  new: '\u041d\u043e\u0432\u044b\u0435',
  approvalDialogTitle: '\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0434\u043e\u0431\u0440\u0435\u043d\u0430',
  approvalDialogSubtitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
  great: '\u041e\u0442\u043b\u0438\u0447\u043d\u043e',
  convenienceOfTruckArrival: '\u0423\u0434\u043e\u0431\u0441\u0442\u0432\u043e \u043f\u0440\u0438\u0435\u0437\u0434\u0430 \u0433\u0440\u0443\u0437\u043e\u0432\u0438\u043a\u0430',
  veryConvenient: '\u041e\u0447\u0435\u043d\u044c \u0443\u0434\u043e\u0431\u043d\u043e',
  securityLevel: '\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438',
  absolutelySafe: '\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e',
  infrastructure: '\u0418\u043d\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430',
  everythingThatWasStatedInTheDescription: '\u0412\u0441\u0435, \u0447\u0442\u043e \u0431\u044b\u043b\u043e \u0443\u043a\u0430\u0437\u0430\u043d\u043e \u0432 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0438',
  comfortForRelaxation: '\u041a\u043e\u043c\u0444\u043e\u0440\u0442 \u0434\u043b\u044f \u043e\u0442\u0434\u044b\u0445\u0430',
  quietAndComfortable: '\u0422\u0438\u0445\u043e \u0438 \u0443\u044e\u0442\u043d\u043e',
  terribly: '\u041e\u0447\u0435\u043d\u044c \u043f\u043b\u043e\u0445\u043e',
  badly: '\u041f\u043b\u043e\u0445\u043e',
  medium: '\u0421\u0440\u0435\u0434\u043d\u0435',
  normally: '\u041d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u043e',
  difficult: '\u0421\u043b\u043e\u0436\u043d\u043e',
  dangerous: '\u041e\u043f\u0430\u0441\u043d\u043e',
  good: '\u0425\u043e\u0440\u043e\u0448\u043e',
  quietly: '\u0421\u043f\u043e\u043a\u043e\u0439\u043d\u043e',
  almostNothingIsAvailable: '\u041f\u043e\u0447\u0442\u0438 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435\u0442',
  onlyHalfOfTheServicesAreAvailable: '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u043b\u043e\u0432\u0438\u043d\u0430 \u0443\u0441\u043b\u0443\u0433',
  almostEverythingThatWasStated: '\u041f\u043e\u0447\u0442\u0438 \u0432\u0441\u0435, \u0447\u0442\u043e \u0431\u044b\u043b\u043e \u0437\u0430\u044f\u0432\u043b\u0435\u043d\u043e',
  nothingButParking: '\u041d\u0438\u0447\u0435\u0433\u043e, \u043a\u0440\u043e\u043c\u0435 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438',
  veryInconvenient: '\u041e\u0447\u0435\u043d\u044c \u043d\u0435\u0443\u0434\u043e\u0431\u043d\u043e',
  inconvenient: '\u041d\u0435\u0443\u0434\u043e\u0431\u043d\u043e',
  rejected: '\u041e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u043d\u044b\u0435',
  rejectRequest: '\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c',
  approveRequest: '\u041f\u0440\u0438\u043d\u044f\u0442\u044c',
  unableToUpdateStatus: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u0443\u0441. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.',
  rejectDialogTitle: '\u041e\u0442\u043a\u043b\u043e\u043d\u0438\u0442\u044c',
  rejectDialogSubtitle: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043f\u0440\u0438\u0447\u0438\u043d\u0443 \u043e\u0442\u043a\u043b\u043e\u043d\u0435\u043d\u0438\u044f',
  rejectDialogDone: '\u0413\u043e\u0442\u043e\u0432\u043e',
  rejectionReasonDuplicate: '\u0414\u0443\u0431\u043b\u0438\u043a\u0430\u0442',
  rejectionReasonIncompleteData: '\u041d\u0435\u043f\u043e\u043b\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435',
  rejectionReasonNotMeetingRequirements: '\u041d\u0435 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0442\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f\u043c',
  requests: '\u0417\u0430\u044f\u0432\u043a\u0438',
    noAddress: '\u041d\u0435\u0442 \u0430\u0434\u0440\u0435\u0441\u0430',
    noComplaints:
      '\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0436\u0430\u043b\u043e\u0431.',
    noParkings: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.',
    noRequests: '\u0417\u0430\u044f\u0432\u043a\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.',
    noPhoto: '\u041d\u0435\u0442 \u0444\u043e\u0442\u043e',
    noPhotos:
      '\u0423 \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0438\u0439.',
    noComment: '\u041d\u0435\u0442 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f',
    noReviews:
      '\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043e\u0442\u0437\u044b\u0432\u043e\u0432.',
    noReviewParkings: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u0441 \u043e\u0442\u0437\u044b\u0432\u0430\u043c\u0438 \u0438\u043b\u0438 \u0436\u0430\u043b\u043e\u0431\u0430\u043c\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.',
    noProfileReviews: '\u041d\u0435\u0442 \u043e\u0442\u0437\u044b\u0432\u043e\u0432',
    noProfileComplaints: '\u041d\u0435\u0442 \u0436\u0430\u043b\u043e\u0431',
    parkingDoesNotExist: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u043d\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442',
    ok: 'OK',
    parkingList: '\u0421\u043f\u0438\u0441\u043e\u043a \u043f\u0430\u0440\u043a\u043e\u0432\u043e\u043a',
    parkingAddedDescription: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430 \u0438 \u0431\u0443\u0434\u0435\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
    parkingAddedTitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430',
    parkingUpdatedDescription: '\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u044b \u0438 \u0431\u0443\u0434\u0443\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u0430\u0440\u0442\u0435',
    parkingUpdatedTitle: '\u041f\u0430\u0440\u043a\u043e\u0432\u043a\u0430 \u0431\u044b\u043b\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0430',
    photo: '\u0424\u043e\u0442\u043e',
    logout: '\u0412\u044b\u0439\u0442\u0438',
    logoutDialogCancel: '\u041e\u0442\u043c\u0435\u043d\u0430',
    logoutDialogConfirm: '\u0412\u044b\u0439\u0442\u0438',
    logoutDialogTitle: '\u0422\u044b \u0443\u0432\u0435\u0440\u0435\u043d, \u0447\u0442\u043e \u0445\u043e\u0447\u0435\u0448\u044c \u0432\u044b\u0439\u0442\u0438 \u0438\u0437 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430?',
    mainNavigation: '\u0413\u043b\u0430\u0432\u043d\u043e\u0435 \u043c\u0435\u043d\u044e',
    readLess: '\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c',
    readMore: '\u0427\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043b\u044c\u0448\u0435',
    recreationArea: '\u0417\u043e\u043d\u0430 \u043e\u0442\u0434\u044b\u0445\u0430',
    reviews: '\u041e\u0442\u0437\u044b\u0432\u044b',
    search: '\u041f\u043e\u0438\u0441\u043a',
    saveChanges: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f',
    shop: '\u041c\u0430\u0433\u0430\u0437\u0438\u043d',
    shower: '\u0414\u0443\u0448',
    specifyReasonForComplaint: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u043f\u0440\u0438\u0447\u0438\u043d\u0443 \u0436\u0430\u043b\u043e\u0431\u044b',
    spots: '\u043c\u0435\u0441\u0442',
    upTo: '\u0414\u043e',
    unableToDeleteParking: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
    unableToDeleteComplaint: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u0436\u0430\u043b\u043e\u0431\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.',
    unableToLoadReviewParkings: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0438 \u0441 \u043e\u0442\u0437\u044b\u0432\u0430\u043c\u0438.',
    unableToLoadParkingList: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u0430\u0440\u043a\u043e\u0432\u043e\u043a.',
    unableToSaveParking: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
    unableToUpdateParking: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
    unableToLogout: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u044b\u0439\u0442\u0438. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.',
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

export type ParkingRejectionReasonCode =
  | 'duplicate'
  | 'incomplete_data'
  | 'not_meeting_requirements'

export function formatParkingRejectionReasonLabel(
  reason: ParkingRejectionReasonCode | null,
  locale: SupportedLocale,
) {
  if (!reason) {
    return null
  }

  const messages = getParkingMessages(locale)

  switch (reason) {
    case 'duplicate':
      return messages.rejectionReasonDuplicate
    case 'incomplete_data':
      return messages.rejectionReasonIncompleteData
    case 'not_meeting_requirements':
      return messages.rejectionReasonNotMeetingRequirements
    default:
      return reason
  }
}

export function formatComplaintReportLabel(
  reportLabel: string | null,
  locale: SupportedLocale,
) {
  if (!reportLabel) {
    return null
  }

  const normalizedLabel = reportLabel.trim().toLowerCase()

  switch (normalizedLabel) {
    case 'report1':
      return getParkingMessages(locale).parkingDoesNotExist
    case 'report2':
      return locale === 'ru'
        ? '\u041e\u043f\u0430\u0441\u043d\u043e\u0435 \u043c\u0435\u0441\u0442\u043e'
        : 'A dangerous place'
    case 'report3':
      return locale === 'ru'
        ? '\u0414\u0440\u0443\u0433\u0430\u044f \u043f\u0440\u043e\u0431\u043b\u0435\u043c\u0430'
        : 'Another problem'
    default:
      return reportLabel
  }
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

export function formatCompactCount(count: number, locale: SupportedLocale) {
  if (count < 1000) {
    return String(count)
  }

  const roundedThousands = Math.round(count / 1000)
  const suffix = locale === 'ru' ? 'к' : 'k'
  return `${roundedThousands}${suffix}`
}

export function formatSpotsCount(count: number, locale: SupportedLocale) {
  if (locale === 'ru') {
    return `${count} ${getRussianPlural(count, '\u043c\u0435\u0441\u0442\u043e', '\u043c\u0435\u0441\u0442\u0430', '\u043c\u0435\u0441\u0442')}`
  }

  return `${count} spot${count === 1 ? '' : 's'}`
}

type ReviewDetailRatingKind =
  | 'arrival'
  | 'comfort'
  | 'impression'
  | 'infrastructure'
  | 'security'

export function formatReviewDetailRating(
  kind: ReviewDetailRatingKind,
  value: number | null,
  locale: SupportedLocale,
) {
  const messages = getParkingMessages(locale)

  switch (kind) {
    case 'impression':
      switch (value) {
        case 1:
          return messages.terribly
        case 2:
          return messages.badly
        case 3:
          return messages.medium
        case 4:
          return messages.normally
        case 5:
          return messages.great
        default:
          return null
      }
    case 'arrival':
      switch (value) {
        case 1:
          return messages.veryInconvenient
        case 2:
          return messages.difficult
        case 3:
          return messages.normally
        case 4:
          return messages.good
        case 5:
          return messages.veryConvenient
        default:
          return null
      }
    case 'security':
      switch (value) {
        case 1:
          return messages.dangerous
        case 2:
          return messages.badly
        case 3:
          return messages.normally
        case 4:
          return messages.quietly
        case 5:
          return messages.absolutelySafe
        default:
          return null
      }
    case 'infrastructure':
      switch (value) {
        case 1:
          return messages.nothingButParking
        case 2:
          return messages.almostNothingIsAvailable
        case 3:
          return messages.onlyHalfOfTheServicesAreAvailable
        case 4:
          return messages.almostEverythingThatWasStated
        case 5:
          return messages.everythingThatWasStatedInTheDescription
        default:
          return null
      }
    case 'comfort':
      switch (value) {
        case 1:
          return messages.veryInconvenient
        case 2:
          return messages.inconvenient
        case 3:
          return messages.medium
        case 4:
          return messages.normally
        case 5:
          return messages.quietAndComfortable
        default:
          return null
      }
    default:
      return null
  }
}

