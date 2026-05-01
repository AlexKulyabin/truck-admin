import { SUPABASE_TABLES } from '../constants/supabaseTables'
import { PARKING_STATUSES } from '../constants/userStatuses'
import { getSupabaseClient } from '../lib/supabase'
import type {
  CreateParkingPointInput,
  ParkingMapFilters,
  ParkingMapItem,
  ParkingMapRequest,
  ParkingInsert,
  ParkingPoint,
} from '../types/parking'

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

type FilteredParkingResponseItem = {
  address?: unknown
  count?: unknown
  id?: unknown
  is_cluster?: unknown
  lat?: unknown
  lng?: unknown
  rating?: unknown
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
