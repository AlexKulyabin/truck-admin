import { SUPABASE_TABLES } from '../constants/supabaseTables'
import { PARKING_STATUSES } from '../constants/userStatuses'
import type {
  AddParkingDraft,
  AddParkingDraftPhoto,
} from '../features/parking/addParkingDraft'
import { getSupabaseClient } from '../lib/supabase'
import type { Database } from '../../types/supabase'
import { getUserProfilePreview } from './userService'
import type {
  ParkingAuthor,
  ParkingComplaint,
  ParkingReportRow,
  CreateParkingInput,
  CreateParkingPointInput,
  ParkingListItem,
  ParkingMapFilters,
  ParkingMapItem,
  ParkingPhoto,
  ParkingPhotoInsert,
  ParkingPhotoRow,
  ParkingRatingSummary,
  ParkingReview,
  ParkingReviewRow,
  ParkingMapRequest,
  ParkingInsert,
  ParkingPoint,
  ParkingRow,
  ParkingRequestItem,
  ParkingUpdate,
  ParkingDetailRecord,
} from '../types/parking'

const PARKING_CONTENT_BUCKET = 'parking_content'

const DEFAULT_MAP_FILTERS: ParkingMapFilters = {
  maxCapacity: 0,
  minCapacity: 0,
  needGas: false,
  needHotel: false,
  needLaundry: false,
  needRecreation: false,
  needShop: false,
  needShower: false,
  searchQuery: '',
}

type ParkingPointRow = {
  address: string | null
  admin_comment: string | null
  id: string
  latitude: number | null
  longitude: number | null
  total_spaces: number | null
}

type ParkingListRow = Pick<
  ParkingRow,
  'address' | 'created_at' | 'id' | 'latitude' | 'longitude' | 'rating'
>

type ParkingRequestRow = Pick<
  ParkingRow,
  'address' | 'created_at' | 'id' | 'latitude' | 'longitude' | 'rating' | 'status'
>

type ParkingReviewFeedRow = Pick<
  ParkingRow,
  'address' | 'created_at' | 'id' | 'latitude' | 'longitude' | 'rating'
>

type FilteredParkingResponseItem = {
  address?: unknown
  count?: unknown
  id?: unknown
  is_cluster?: unknown
  lat?: unknown
  lng?: unknown
  rating?: unknown
}

type ParkingPhotoItem = Pick<ParkingPhotoRow, 'id' | 'url'>

type ParkingAuthorRow = Pick<ParkingRow, 'created_by'>
type ParkingEditRow = Pick<
  ParkingRow,
  | 'address'
  | 'has_gas_station'
  | 'has_hotel'
  | 'has_laundry'
  | 'has_recreation_area'
  | 'has_shop'
  | 'has_shower'
  | 'latitude'
  | 'longitude'
  | 'total_spaces'
>

type ParkingReviewSummaryRow = Pick<
  ParkingRow,
  'rating' | 'reviews_count' | 'stars_1' | 'stars_2' | 'stars_3' | 'stars_4' | 'stars_5'
>

type ParkingReviewItem = Pick<
  ParkingReviewRow,
  | 'average_score'
  | 'comment'
  | 'created_at'
  | 'id'
  | 'parking_id'
  | 'rating_arrival'
  | 'rating_comfort'
  | 'rating_impression'
  | 'rating_infrastructure'
  | 'rating_security'
  | 'user_id'
>

type ParkingReviewPhotoItem = Pick<ParkingPhotoRow, 'id' | 'review_id' | 'url'>
type ParkingComplaintItem = Pick<
  ParkingReportRow,
  'comment' | 'created_at' | 'id' | 'report' | 'user_id'
>
type ParkingReviewContentItem = Pick<
  ParkingReviewRow,
  | 'average_score'
  | 'comment'
  | 'created_at'
  | 'id'
  | 'parking_id'
  | 'rating_arrival'
  | 'rating_comfort'
  | 'rating_impression'
  | 'rating_infrastructure'
  | 'rating_security'
>
type ParkingAddressRow = Pick<ParkingRow, 'address' | 'id'>

function dataUrlToBlob(dataUrl: string) {
  return fetch(dataUrl).then((response) => response.blob())
}

function getFileExtension(mimeType: string) {
  const extension = mimeType.split('/')[1]?.split(';')[0]

  if (!extension) {
    return 'jpg'
  }

  return extension === 'jpeg' ? 'jpg' : extension
}

function createParkingPhotoFileName(index: number, mimeType: string) {
  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${index}`

  return `${Date.now()}-${uniqueId}.${getFileExtension(mimeType)}`
}

function normalizeNewParkingAddress(address: string) {
  const normalizedAddress = address.trim()
  return normalizedAddress || 'no address'
}

function normalizeCapacity(value: number | null) {
  if (value === null || !Number.isFinite(value) || value < 0) {
    return null
  }

  return Math.trunc(value)
}

async function uploadNewParkingPhotos({
  client,
  parkingId,
  photos,
  userId,
}: {
  client: ReturnType<typeof getSupabaseClient>
  parkingId: string
  photos: AddParkingDraftPhoto[]
  userId: string
}) {
  const photoRows: ParkingPhotoInsert[] = []

  for (const [index, photo] of photos.entries()) {
    if (!photo.isNew) {
      continue
    }

    const blob = await dataUrlToBlob(photo.url)
    const fileName = createParkingPhotoFileName(index, blob.type)
    const path = `parkings/${parkingId}/${fileName}`
    const { error: uploadError } = await client.storage
      .from(PARKING_CONTENT_BUCKET)
      .upload(path, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Upload parking photo failed: ${getSupabaseErrorMessage(uploadError)}`)
    }

    const {
      data: { publicUrl },
    } = client.storage.from(PARKING_CONTENT_BUCKET).getPublicUrl(path)

    photoRows.push({
      parking_id: parkingId,
      url: publicUrl,
      user_id: userId,
    })
  }

  if (photoRows.length > 0) {
    const { error: photosError } = await client
      .from(SUPABASE_TABLES.PARKING_PHOTOS)
      .insert(photoRows)

    if (photosError) {
      throw new Error(`Create parking photo records failed: ${getSupabaseErrorMessage(photosError)}`)
    }
  }
}

function getSupabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as Record<string, unknown>
    const parts = [record.message, record.code, record.details, record.hint]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)

    if (parts.length > 0) {
      return parts.join(' ')
    }
  }

  return 'Unknown Supabase error'
}

function getStoragePathFromPublicUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    const marker = `/object/public/${PARKING_CONTENT_BUCKET}/`
    const markerIndex = parsedUrl.pathname.indexOf(marker)

    if (markerIndex === -1) {
      return null
    }

    return decodeURIComponent(parsedUrl.pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}

function getParkingContentStoragePath(url: string) {
  return getStoragePathFromPublicUrl(url)
}

function normalizeParkingPoint(point: ParkingPointRow): ParkingPoint {
  if (point.latitude === null || point.longitude === null) {
    throw new Error('Parking coordinates are missing')
  }

  return {
    id: point.id,
    capacity: point.total_spaces,
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
    name: point.address ?? 'Parking',
    notes: point.admin_comment ?? '',
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeFilteredParkingItem(value: unknown): ParkingMapItem | null {
  if (!isRecord(value)) {
    return null
  }

  const item = value as FilteredParkingResponseItem
  const id = typeof item.id === 'string' ? item.id : null
  const latitude = typeof item.lat === 'number' ? item.lat : null
  const longitude = typeof item.lng === 'number' ? item.lng : null

  if (!id || latitude === null || longitude === null) {
    return null
  }

  const count = typeof item.count === 'number' ? item.count : 1
  const isCluster = item.is_cluster === true || count > 1

  return {
    id,
    address: typeof item.address === 'string' ? item.address : null,
    count,
    isCluster,
    latitude,
    longitude,
    rating: typeof item.rating === 'number' ? item.rating : null,
  }
}

function normalizeParkingPhoto(photo: ParkingPhotoItem): ParkingPhoto {
  return {
    id: photo.id,
    url: photo.url,
  }
}

function normalizeParkingListItem(parking: ParkingListRow): ParkingListItem {
  return {
    address: parking.address,
    createdAt: parking.created_at,
    id: parking.id,
    latitude: parking.latitude,
    longitude: parking.longitude,
    rating: parking.rating,
  }
}

function normalizeParkingRequestItem(
  parking: ParkingRequestRow,
): ParkingRequestItem {
  return {
    ...normalizeParkingListItem(parking),
    status: parking.status ?? 'pending',
  }
}

function normalizeParkingAuthor(
  profile: Awaited<ReturnType<typeof getUserProfilePreview>>,
): ParkingAuthor {
  return {
    avatarUrl: profile?.avatar_url ?? null,
    fullName: profile?.full_name ?? null,
    id: profile?.id ?? null,
  }
}

function normalizeParkingReviewSummary(
  reviewSummary: ParkingReviewSummaryRow | null,
): ParkingRatingSummary {
  return {
    averageRating: reviewSummary?.rating ?? null,
    reviewsCount: reviewSummary?.reviews_count ?? 0,
    starCounts: {
      1: reviewSummary?.stars_1 ?? 0,
      2: reviewSummary?.stars_2 ?? 0,
      3: reviewSummary?.stars_3 ?? 0,
      4: reviewSummary?.stars_4 ?? 0,
      5: reviewSummary?.stars_5 ?? 0,
    },
  }
}

export async function listFilteredParkingMapItems(
  request: ParkingMapRequest,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const filters = { ...DEFAULT_MAP_FILTERS, ...request.filters }
  const query = client.rpc('get_filtered_parkings', {
    center_lat: request.center.lat,
    center_lng: request.center.lng,
    is_filter_active: false,
    max_capacity: filters.maxCapacity,
    max_lat: request.bounds.maxLat,
    max_lng: request.bounds.maxLng,
    min_capacity: filters.minCapacity,
    min_lat: request.bounds.minLat,
    min_lng: request.bounds.minLng,
    need_gas: filters.needGas,
    need_hotel: filters.needHotel,
    need_laundry: filters.needLaundry,
    need_recreation: filters.needRecreation,
    need_shop: filters.needShop,
    need_shower: filters.needShower,
    radius_meters: 0,
    search_query: filters.searchQuery.trim() || undefined,
    zoom_level: request.zoom,
  })

  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query

  if (error) {
    throw error
  }

  return (data || [])
    .map(normalizeFilteredParkingItem)
    .filter((item): item is ParkingMapItem => item !== null)
}

export async function listParkingPhotos(
  parkingId: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const query = client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('id, url')
    .eq('parking_id', parkingId)
    .order('created_at', { ascending: true })

  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query

  if (error) {
    throw error
  }

  return (data || []).map(normalizeParkingPhoto)
}

export async function listParkingItems(searchQuery: string, signal?: AbortSignal) {
  const client = getSupabaseClient()
  let query = client
    .from(SUPABASE_TABLES.PARKINGS)
    .select('id, address, created_at, latitude, longitude, rating')
    .order('created_at', { ascending: false })

  const normalizedQuery = searchQuery.trim()

  if (normalizedQuery) {
    query = query.ilike('address_lower', `%${normalizedQuery.toLowerCase()}%`)
  }

  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query

  if (error) {
    throw error
  }

  return (data ?? []).map((parking) =>
    normalizeParkingListItem(parking as ParkingListRow),
  )
}

export async function listReviewParkingItems(
  searchQuery: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const normalizedQuery = searchQuery.trim().toLowerCase()

  async function loadParkingRowsByIds(parkingIds: string[]) {
    if (parkingIds.length === 0) {
      return [] as ParkingReviewFeedRow[]
    }

    let query = client
      .from(SUPABASE_TABLES.PARKINGS)
      .select('id, address, created_at, latitude, longitude, rating')
      .in('id', parkingIds)
      .order('created_at', { ascending: false })

    if (normalizedQuery) {
      query = query.ilike('address_lower', `%${normalizedQuery}%`)
    }

    const { data, error } = signal ? await query.abortSignal(signal) : await query

    if (error) {
      throw error
    }

    return (data ?? []) as ParkingReviewFeedRow[]
  }

  let reviewedQuery = client
    .from(SUPABASE_TABLES.PARKINGS)
    .select('id, address, created_at, latitude, longitude, rating')
    .gt('reviews_count', 0)
    .order('created_at', { ascending: false })

  if (normalizedQuery) {
    reviewedQuery = reviewedQuery.ilike('address_lower', `%${normalizedQuery}%`)
  }

  const reportsQuery = client
    .from(SUPABASE_TABLES.REPORTS)
    .select('parking_id')
    .not('parking_id', 'is', null)

  const [{ data: reviewedData, error: reviewedError }, { data: reportData, error: reportError }] =
    signal
      ? await Promise.all([reviewedQuery.abortSignal(signal), reportsQuery.abortSignal(signal)])
      : await Promise.all([reviewedQuery, reportsQuery])

  if (reviewedError) {
    throw reviewedError
  }

  if (reportError) {
    throw reportError
  }

  const reviewedParkings = (reviewedData ?? []) as ParkingReviewFeedRow[]
  const reportParkingIds = Array.from(
    new Set(
      (reportData ?? [])
        .map((row) =>
          isRecord(row) && typeof row.parking_id === 'string' ? row.parking_id : null,
        )
        .filter((parkingId): parkingId is string => Boolean(parkingId)),
    ),
  )
  const reportedParkings = await loadParkingRowsByIds(reportParkingIds)
  const parkingsById = new Map<string, ParkingReviewFeedRow>()

  for (const parking of [...reviewedParkings, ...reportedParkings]) {
    parkingsById.set(parking.id, parking)
  }

  return Array.from(parkingsById.values())
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .map((parking) => normalizeParkingListItem(parking as ParkingListRow))
}

export async function listParkingRequests(
  searchQuery: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  let query = client
    .from(SUPABASE_TABLES.PARKINGS)
    .select('id, address, created_at, latitude, longitude, rating, status')
    .order('created_at', { ascending: false })

  const normalizedQuery = searchQuery.trim()

  if (normalizedQuery) {
    query = query.ilike('address_lower', `%${normalizedQuery.toLowerCase()}%`)
  }

  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query

  if (error) {
    throw error
  }

  return (data ?? []).map((parking) =>
    normalizeParkingRequestItem(parking as ParkingRequestRow),
  )
}

export async function countParkingRequestsByStatus(
  searchQuery: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const normalizedQuery = searchQuery.trim().toLowerCase()

  async function countByStatus(
    status: ParkingRequestRow['status'],
  ): Promise<number> {
    let query = client
      .from(SUPABASE_TABLES.PARKINGS)
      .select('id', { count: 'exact', head: true })
      .eq('status', status)

    if (normalizedQuery) {
      query = query.ilike('address_lower', `%${normalizedQuery}%`)
    }

    const { count, error } = signal
      ? await query.abortSignal(signal)
      : await query

    if (error) {
      throw error
    }

    return count ?? 0
  }

  const [pending, approved, rejected] = await Promise.all([
    countByStatus('pending'),
    countByStatus('approved'),
    countByStatus('rejected'),
  ])

  return { approved, pending, rejected }
}

export async function getParkingAuthor(
  parkingId: string,
  _signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .select('created_by')
    .eq('id', parkingId)
    .maybeSingle()

  if (error) {
    throw error
  }

  const parkingAuthor = data as ParkingAuthorRow | null

  if (!parkingAuthor?.created_by) {
    return normalizeParkingAuthor(null)
  }

  const profile = await getUserProfilePreview(parkingAuthor.created_by)
  return normalizeParkingAuthor(profile)
}

export async function getParkingReviewSummary(
  parkingId: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const query = client
    .from(SUPABASE_TABLES.PARKINGS)
    .select('rating, reviews_count, stars_1, stars_2, stars_3, stars_4, stars_5')
    .eq('id', parkingId)
    .limit(1)

  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query

  if (error) {
    throw error
  }

  return normalizeParkingReviewSummary((data?.[0] ?? null) as ParkingReviewSummaryRow | null)
}

export async function getParkingDetails(parkingId: string) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .select(
      'address, has_gas_station, has_hotel, has_laundry, has_recreation_area, has_shop, has_shower, rating, total_spaces',
    )
    .eq('id', parkingId)
    .maybeSingle()

  if (error) {
    throw new Error(`Load parking details failed: ${getSupabaseErrorMessage(error)}`)
  }

  return data as ParkingDetailRecord | null
}

export async function listParkingReviews(
  parkingId: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const reviewsQuery = client
    .from(SUPABASE_TABLES.REVIEWS)
    .select(
      'id, created_at, average_score, comment, parking_id, rating_arrival, rating_comfort, rating_impression, rating_infrastructure, rating_security, user_id',
    )
    .eq('parking_id', parkingId)
    .order('created_at', { ascending: false })

  const photosQuery = client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('id, review_id, url')
    .eq('parking_id', parkingId)
    .not('review_id', 'is', null)
    .order('created_at', { ascending: true })

  const [{ data: reviewsData, error: reviewsError }, { data: photosData, error: photosError }] =
    signal
      ? await Promise.all([
          reviewsQuery.abortSignal(signal),
          photosQuery.abortSignal(signal),
        ])
      : await Promise.all([reviewsQuery, photosQuery])

  if (reviewsError) {
    throw reviewsError
  }

  if (photosError) {
    throw photosError
  }

  const reviews = (reviewsData ?? []) as ParkingReviewItem[]
  const reviewPhotos = (photosData ?? []) as ParkingReviewPhotoItem[]
  const photosByReviewId = new Map<number, ParkingPhoto[]>()

  reviewPhotos.forEach((photo) => {
    if (photo.review_id === null) {
      return
    }

    const currentPhotos = photosByReviewId.get(photo.review_id) ?? []
    currentPhotos.push({
      id: photo.id,
      url: photo.url,
    })
    photosByReviewId.set(photo.review_id, currentPhotos)
  })

  const userIds = Array.from(
    new Set(
      reviews
        .map((review) => review.user_id)
        .filter((userId): userId is string => Boolean(userId)),
    ),
  )

  const usersById = new Map<string, Awaited<ReturnType<typeof getUserProfilePreview>>>()

  if (userIds.length > 0) {
    const usersQuery = client
      .from(SUPABASE_TABLES.USERS)
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    const { data: usersData, error: usersError } = signal
      ? await usersQuery.abortSignal(signal)
      : await usersQuery

    if (usersError) {
      throw usersError
    }

    for (const user of usersData ?? []) {
      usersById.set(user.id, user)
    }
  }

  return reviews.map<ParkingReview>((review) => {
    const reviewAuthor = review.user_id ? usersById.get(review.user_id) ?? null : null

    return {
      authorAvatarUrl: reviewAuthor?.avatar_url ?? null,
      authorName: reviewAuthor?.full_name ?? null,
      comment: review.comment,
      createdAt: review.created_at,
      id: review.id,
      parkingAddress: null,
      parkingId: review.parking_id ?? null,
      photos: photosByReviewId.get(review.id) ?? [],
      ratingArrival: review.rating_arrival ?? null,
      ratingComfort: review.rating_comfort ?? null,
      ratingImpression: review.rating_impression ?? null,
      ratingInfrastructure: review.rating_infrastructure ?? null,
      ratingSecurity: review.rating_security ?? null,
      score: review.average_score,
      thumbnailUrl: photosByReviewId.get(review.id)?.[0]?.url ?? null,
    }
  })
}

export async function listUserReviews(userId: string, signal?: AbortSignal) {
  const client = getSupabaseClient()
  const profile = await getUserProfilePreview(userId)

  const reviewsQuery = client
    .from(SUPABASE_TABLES.REVIEWS)
    .select(
      'id, created_at, average_score, comment, parking_id, rating_arrival, rating_comfort, rating_impression, rating_infrastructure, rating_security',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: reviewsData, error: reviewsError } = signal
    ? await reviewsQuery.abortSignal(signal)
    : await reviewsQuery

  if (reviewsError) {
    throw reviewsError
  }

  const reviews = (reviewsData ?? []) as ParkingReviewContentItem[]
  const parkingIds = Array.from(
    new Set(
      reviews
        .map((review) => review.parking_id)
        .filter((parkingId): parkingId is string => Boolean(parkingId)),
    ),
  )
  const reviewIds = reviews.map((review) => review.id)
  const photosByReviewId = new Map<number, ParkingPhoto[]>()
  const parkingAddressesById = new Map<string, string | null>()

  if (parkingIds.length > 0) {
    const parkingsQuery = client
      .from(SUPABASE_TABLES.PARKINGS)
      .select('id, address')
      .in('id', parkingIds)

    const { data: parkingsData, error: parkingsError } = signal
      ? await parkingsQuery.abortSignal(signal)
      : await parkingsQuery

    if (parkingsError) {
      throw parkingsError
    }

    for (const parking of (parkingsData ?? []) as ParkingAddressRow[]) {
      parkingAddressesById.set(parking.id, parking.address)
    }
  }

  if (reviewIds.length > 0) {
    const photosQuery = client
      .from(SUPABASE_TABLES.PARKING_PHOTOS)
      .select('id, review_id, url')
      .in('review_id', reviewIds)
      .order('created_at', { ascending: true })

    const { data: photosData, error: photosError } = signal
      ? await photosQuery.abortSignal(signal)
      : await photosQuery

    if (photosError) {
      throw photosError
    }

    for (const photo of (photosData ?? []) as ParkingReviewPhotoItem[]) {
      if (photo.review_id === null) {
        continue
      }

      const currentPhotos = photosByReviewId.get(photo.review_id) ?? []
      currentPhotos.push({
        id: photo.id,
        url: photo.url,
      })
      photosByReviewId.set(photo.review_id, currentPhotos)
    }
  }

  return reviews.map<ParkingReview>((review) => ({
    authorAvatarUrl: profile?.avatar_url ?? null,
    authorName: profile?.full_name ?? null,
    comment: review.comment,
    createdAt: review.created_at,
    id: review.id,
    parkingAddress: review.parking_id
      ? parkingAddressesById.get(review.parking_id) ?? null
      : null,
    parkingId: review.parking_id ?? null,
    photos: photosByReviewId.get(review.id) ?? [],
    ratingArrival: review.rating_arrival ?? null,
    ratingComfort: review.rating_comfort ?? null,
    ratingImpression: review.rating_impression ?? null,
    ratingInfrastructure: review.rating_infrastructure ?? null,
    ratingSecurity: review.rating_security ?? null,
    score: review.average_score,
    thumbnailUrl: photosByReviewId.get(review.id)?.[0]?.url ?? null,
  }))
}

export async function listParkingComplaints(
  parkingId: string,
  signal?: AbortSignal,
) {
  const client = getSupabaseClient()
  const complaintsQuery = client
    .from(SUPABASE_TABLES.REPORTS)
    .select('id, created_at, comment, report, user_id')
    .eq('parking_id', parkingId)
    .order('created_at', { ascending: false })

  const { data, error } = signal
    ? await complaintsQuery.abortSignal(signal)
    : await complaintsQuery

  if (error) {
    throw error
  }

  const complaints = (data ?? []) as ParkingComplaintItem[]
  const userIds = Array.from(
    new Set(
      complaints
        .map((complaint) => complaint.user_id)
        .filter((userId): userId is string => Boolean(userId)),
    ),
  )
  const usersById = new Map<string, Awaited<ReturnType<typeof getUserProfilePreview>>>()

  if (userIds.length > 0) {
    const usersQuery = client
      .from(SUPABASE_TABLES.USERS)
      .select('id, full_name, avatar_url')
      .in('id', userIds)

    const { data: usersData, error: usersError } = signal
      ? await usersQuery.abortSignal(signal)
      : await usersQuery

    if (usersError) {
      throw usersError
    }

    for (const user of usersData ?? []) {
      usersById.set(user.id, user)
    }
  }

  return complaints.map<ParkingComplaint>((complaint) => {
    const complaintAuthor = complaint.user_id
      ? usersById.get(complaint.user_id) ?? null
      : null
    const normalizedReport = complaint.report?.trim().toLowerCase() ?? null

    return {
      authorAvatarUrl: complaintAuthor?.avatar_url ?? null,
      authorName: complaintAuthor?.full_name ?? null,
      comment: complaint.comment?.trim() || null,
      createdAt: complaint.created_at,
      id: complaint.id,
      reportLabel: normalizedReport ?? null,
    }
  })
}

export async function listUserComplaints(userId: string, signal?: AbortSignal) {
  const client = getSupabaseClient()
  const profile = await getUserProfilePreview(userId)

  const complaintsQuery = client
    .from(SUPABASE_TABLES.REPORTS)
    .select('id, created_at, comment, report')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data, error } = signal
    ? await complaintsQuery.abortSignal(signal)
    : await complaintsQuery

  if (error) {
    throw error
  }

  return (data ?? []).map<ParkingComplaint>((complaint) => {
    const normalizedReport = complaint.report?.trim().toLowerCase() ?? null

    return {
      authorAvatarUrl: profile?.avatar_url ?? null,
      authorName: profile?.full_name ?? null,
      comment: complaint.comment?.trim() || null,
      createdAt: complaint.created_at,
      id: complaint.id,
      reportLabel: normalizedReport ?? null,
    }
  })
}

export async function createParkingPoint(parkingPoint: CreateParkingPointInput) {
  const client = getSupabaseClient()
  const parkingInsert: ParkingInsert = {
    address: parkingPoint.name,
    admin_comment: parkingPoint.notes,
    latitude: parkingPoint.latitude,
    longitude: parkingPoint.longitude,
    total_spaces: parkingPoint.capacity,
    status: PARKING_STATUSES.APPROVED,
  }

  const { data, error } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .insert(parkingInsert)
    .select('id, address, latitude, longitude, total_spaces, admin_comment')
    .single()

  if (error) {
    throw error
  }

  return normalizeParkingPoint(data)
}

export async function createParking(parking: CreateParkingInput) {
  const client = getSupabaseClient()
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError || !user) {
    throw userError ?? new Error('Unable to resolve current user')
  }

  const address = normalizeNewParkingAddress(parking.address)
  const parkingInsert: ParkingInsert = {
    address,
    address_lower: address.toLowerCase(),
    created_by: user.id,
    has_gas_station: parking.services.gas,
    has_hotel: parking.services.hotel,
    has_laundry: parking.services.laundry,
    has_recreation_area: parking.services.recreation,
    has_shop: parking.services.shop,
    has_shower: parking.services.shower,
    latitude: parking.latitude,
    longitude: parking.longitude,
    status: PARKING_STATUSES.APPROVED,
    total_spaces: normalizeCapacity(parking.capacity),
  }

  const { data: createdParking, error: parkingError } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .insert(parkingInsert)
    .select('id')
    .single()

  if (parkingError) {
    throw new Error(`Create parking failed: ${getSupabaseErrorMessage(parkingError)}`)
  }

  await uploadNewParkingPhotos({
    client,
    parkingId: createdParking.id,
    photos: parking.photos,
    userId: user.id,
  })

  return createdParking.id
}

export async function getParkingForEdit(parkingId: string): Promise<AddParkingDraft> {
  const client = getSupabaseClient()
  const { data: parking, error: parkingError } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .select(
      'address, has_gas_station, has_hotel, has_laundry, has_recreation_area, has_shop, has_shower, latitude, longitude, total_spaces',
    )
    .eq('id', parkingId)
    .maybeSingle()

  if (parkingError) {
    throw new Error(`Load parking for edit failed: ${getSupabaseErrorMessage(parkingError)}`)
  }

  if (!parking) {
    throw new Error('Parking was not found')
  }

  const { data: photos, error: photosError } = await client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('id, url')
    .eq('parking_id', parkingId)
    .is('review_id', null)
    .order('created_at', { ascending: true })

  if (photosError) {
    throw new Error(`Load parking photos for edit failed: ${getSupabaseErrorMessage(photosError)}`)
  }

  const parkingRow = parking as ParkingEditRow

  return {
    address: parkingRow.address ?? '',
    capacity:
      typeof parkingRow.total_spaces === 'number'
        ? String(parkingRow.total_spaces)
        : '',
    latitude: parkingRow.latitude,
    longitude: parkingRow.longitude,
    photos: ((photos ?? []) as ParkingPhotoItem[]).map((photo) => ({
      id: photo.id,
      isNew: false,
      url: photo.url,
    })),
    services: {
      gas: parkingRow.has_gas_station,
      hotel: parkingRow.has_hotel,
      laundry: parkingRow.has_laundry,
      recreation: parkingRow.has_recreation_area,
      shop: parkingRow.has_shop,
      shower: parkingRow.has_shower,
    },
  }
}

export async function updateParkingStatus(
  parkingId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: Database['public']['Enums']['parking_rejection_reason'] | null,
) {
  const client = getSupabaseClient()
  const updateData =
    status === 'rejected'
      ? { rejection_reason: rejectionReason ?? null, status }
      : { rejection_reason: null, status }

  const { error } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .update(updateData)
    .eq('id', parkingId)

  if (error) {
    throw new Error(`Update parking status failed: ${getSupabaseErrorMessage(error)}`)
  }
}

export async function deleteParking(parkingId: string) {
  const client = getSupabaseClient()

  const { data: parkingPhotos, error: parkingPhotosError } = await client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('url')
    .eq('parking_id', parkingId)

  if (parkingPhotosError) {
    throw new Error(`Load parking photos for delete failed: ${getSupabaseErrorMessage(parkingPhotosError)}`)
  }

  const photoUrls = ((parkingPhotos ?? []) as Array<{ url: string }>).map((photo) => photo.url)

  const deletionSteps = [
    client.from(SUPABASE_TABLES.FAVORITES).delete().eq('parking_id', parkingId),
    client.from(SUPABASE_TABLES.PARKING_PHOTOS).delete().eq('parking_id', parkingId),
    client.from(SUPABASE_TABLES.REPORTS).delete().eq('parking_id', parkingId),
    client.from(SUPABASE_TABLES.REVIEWS).delete().eq('parking_id', parkingId),
    client.from(SUPABASE_TABLES.PARKINGS).delete().eq('id', parkingId),
  ] as const

  for (const step of deletionSteps) {
    const { error } = await step

    if (error) {
      throw new Error(`Delete parking failed: ${getSupabaseErrorMessage(error)}`)
    }
  }

  const storagePaths = photoUrls
    .map((url) => getParkingContentStoragePath(url))
    .filter((path): path is string => Boolean(path))

  if (storagePaths.length > 0) {
    const { error: storageError } = await client.storage
      .from(PARKING_CONTENT_BUCKET)
      .remove(storagePaths)

    if (storageError) {
      console.warn('Delete parking storage cleanup failed:', getSupabaseErrorMessage(storageError))
    }
  }
}

export async function deleteParkingReview(reviewId: number) {
  const client = getSupabaseClient()

  const { data: reviewPhotos, error: photosError } = await client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('url')
    .eq('review_id', reviewId)

  if (photosError) {
    throw new Error(`Load review photos for delete failed: ${getSupabaseErrorMessage(photosError)}`)
  }

  const photoUrls = ((reviewPhotos ?? []) as Array<{ url: string }>).map((photo) => photo.url)

  const deletionSteps = [
    client.from(SUPABASE_TABLES.PARKING_PHOTOS).delete().eq('review_id', reviewId),
    client.from(SUPABASE_TABLES.REVIEWS).delete().eq('id', reviewId),
  ] as const

  for (const step of deletionSteps) {
    const { error } = await step

    if (error) {
      throw new Error(`Delete review failed: ${getSupabaseErrorMessage(error)}`)
    }
  }

  const storagePaths = photoUrls
    .map((url) => getParkingContentStoragePath(url))
    .filter((path): path is string => Boolean(path))

  if (storagePaths.length > 0) {
    const { error: storageError } = await client.storage
      .from(PARKING_CONTENT_BUCKET)
      .remove(storagePaths)

    if (storageError) {
      console.warn('Delete review storage cleanup failed:', getSupabaseErrorMessage(storageError))
    }
  }
}

export async function deleteParkingComplaint(complaintId: number) {
  const client = getSupabaseClient()
  const { error } = await client
    .from(SUPABASE_TABLES.REPORTS)
    .delete()
    .eq('id', complaintId)

  if (error) {
    throw new Error(`Delete complaint failed: ${getSupabaseErrorMessage(error)}`)
  }
}

export async function updateParking(parkingId: string, parking: CreateParkingInput) {
  const client = getSupabaseClient()
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser()

  if (userError || !user) {
    throw userError ?? new Error('Unable to resolve current user')
  }

  const address = normalizeNewParkingAddress(parking.address)
  const parkingUpdate: ParkingUpdate = {
    address,
    address_lower: address.toLowerCase(),
    has_gas_station: parking.services.gas,
    has_hotel: parking.services.hotel,
    has_laundry: parking.services.laundry,
    has_recreation_area: parking.services.recreation,
    has_shop: parking.services.shop,
    has_shower: parking.services.shower,
    latitude: parking.latitude,
    longitude: parking.longitude,
    total_spaces: normalizeCapacity(parking.capacity),
  }

  const { error: parkingError } = await client
    .from(SUPABASE_TABLES.PARKINGS)
    .update(parkingUpdate)
    .eq('id', parkingId)

  if (parkingError) {
    throw new Error(`Update parking failed: ${getSupabaseErrorMessage(parkingError)}`)
  }

  const { data: existingPhotos, error: existingPhotosError } = await client
    .from(SUPABASE_TABLES.PARKING_PHOTOS)
    .select('id, url')
    .eq('parking_id', parkingId)
    .is('review_id', null)

  if (existingPhotosError) {
    throw new Error(`Load existing parking photos failed: ${getSupabaseErrorMessage(existingPhotosError)}`)
  }

  const retainedPhotoIds = new Set(
    parking.photos
      .filter((photo) => !photo.isNew && photo.id)
      .map((photo) => photo.id as string),
  )
  const photoIdsToDelete = ((existingPhotos ?? []) as ParkingPhotoItem[])
    .map((photo) => photo.id)
    .filter((photoId) => !retainedPhotoIds.has(photoId))

  if (photoIdsToDelete.length > 0) {
    const { error: deletePhotosError } = await client
      .from(SUPABASE_TABLES.PARKING_PHOTOS)
      .delete()
      .in('id', photoIdsToDelete)

    if (deletePhotosError) {
      throw new Error(`Delete parking photo records failed: ${getSupabaseErrorMessage(deletePhotosError)}`)
    }
  }

  await uploadNewParkingPhotos({
    client,
    parkingId,
    photos: parking.photos,
    userId: user.id,
  })
}
