import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase'
import type { ParkingStatus } from '../constants/userStatuses'
import type {
  AddParkingDraftPhoto,
  AddParkingServiceKey,
} from '../features/parking/addParkingDraft'

export type ParkingRow = Tables<'parkings'>
export type ParkingInsert = TablesInsert<'parkings'>
export type ParkingUpdate = TablesUpdate<'parkings'>
export type ParkingPhotoRow = Tables<'parking_photos'>
export type ParkingPhotoInsert = TablesInsert<'parking_photos'>
export type ParkingReportRow = Tables<'reports'>
export type ParkingReviewRow = Tables<'reviews'>

export type ParkingPoint = {
  id: string
  capacity: number | null
  latitude: number
  longitude: number
  name: string
  notes: string
}

export type ParkingMapItem = {
  id: string
  address: string | null
  count: number
  isCluster: boolean
  latitude: number
  longitude: number
  rating: number | null
}

export type ParkingListItem = {
  address: string | null
  createdAt: string
  id: string
  latitude: number | null
  longitude: number | null
  rating: number | null
}

export type ParkingRequestItem = ParkingListItem & {
  status: ParkingStatus
}

export type ParkingDetailItem = Pick<ParkingMapItem, 'address' | 'id' | 'rating'>

export type ParkingDetailRecord = Pick<
  ParkingRow,
  | 'address'
  | 'has_gas_station'
  | 'has_hotel'
  | 'has_laundry'
  | 'has_recreation_area'
  | 'has_shop'
  | 'has_shower'
  | 'rating'
  | 'total_spaces'
>

export type ParkingPhoto = {
  id: string
  url: string
}

export type ParkingAuthor = {
  avatarUrl: string | null
  fullName: string | null
  id: string | null
}

export type ParkingRatingSummary = {
  averageRating: number | null
  reviewsCount: number
  starCounts: Record<1 | 2 | 3 | 4 | 5, number>
}

export type ParkingReview = {
  authorAvatarUrl: string | null
  authorName: string | null
  comment: string | null
  createdAt: string
  id: number
  parkingAddress: string | null
  parkingId: string | null
  photos: ParkingPhoto[]
  score: number | null
  thumbnailUrl: string | null
}

export type ParkingComplaint = {
  authorAvatarUrl: string | null
  authorName: string | null
  comment: string | null
  createdAt: string
  id: number
  reportLabel: string | null
}

export type ParkingMapBounds = {
  maxLat: number
  maxLng: number
  minLat: number
  minLng: number
}

export type ParkingMapCenter = {
  lat: number
  lng: number
}

export type ParkingMapFilters = {
  maxCapacity: number
  minCapacity: number
  needGas: boolean
  needHotel: boolean
  needLaundry: boolean
  needRecreation: boolean
  needShop: boolean
  needShower: boolean
  searchQuery: string
}

export type ParkingMapRequest = {
  bounds: ParkingMapBounds
  center: ParkingMapCenter
  filters?: Partial<ParkingMapFilters>
  zoom: number
}

export type CreateParkingPointInput = {
  capacity: number | null
  latitude: number
  longitude: number
  name: string
  notes: string
}

export type CreateParkingInput = {
  address: string
  capacity: number | null
  latitude: number
  longitude: number
  photos: AddParkingDraftPhoto[]
  services: Record<AddParkingServiceKey, boolean>
}
