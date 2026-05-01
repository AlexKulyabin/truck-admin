import { getSupabaseClient } from '../lib/supabase'

const PARKING_POINTS_TABLE = 'parking_points'

function normalizeParkingPoint(point) {
  return {
    id: point.id,
    name: point.name,
    latitude: Number(point.latitude),
    longitude: Number(point.longitude),
    capacity: point.capacity === null ? null : Number(point.capacity),
    notes: point.notes ?? '',
  }
}

export async function listParkingPoints() {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from(PARKING_POINTS_TABLE)
    .select('id, name, latitude, longitude, capacity, notes')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(normalizeParkingPoint)
}

export async function createParkingPoint(parkingPoint) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from(PARKING_POINTS_TABLE)
    .insert({
      name: parkingPoint.name,
      latitude: parkingPoint.latitude,
      longitude: parkingPoint.longitude,
      capacity: parkingPoint.capacity,
      notes: parkingPoint.notes,
    })
    .select('id, name, latitude, longitude, capacity, notes')
    .single()

  if (error) {
    throw error
  }

  return normalizeParkingPoint(data)
}
