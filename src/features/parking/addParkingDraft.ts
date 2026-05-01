export type AddParkingServiceKey =
  | 'gas'
  | 'hotel'
  | 'laundry'
  | 'recreation'
  | 'shop'
  | 'shower'

export type AddParkingDraft = {
  address: string
  capacity: string
  latitude: number | null
  longitude: number | null
  photos: string[]
  services: Record<AddParkingServiceKey, boolean>
}

export const ADD_PARKING_STORAGE_KEY = 'truck-admin-add-parking-draft'

export const EMPTY_ADD_PARKING_SERVICES: Record<AddParkingServiceKey, boolean> = {
  gas: false,
  hotel: false,
  laundry: false,
  recreation: false,
  shop: false,
  shower: false,
}

export function createEmptyAddParkingDraft(): AddParkingDraft {
  return {
    address: '',
    capacity: '',
    latitude: null,
    longitude: null,
    photos: [],
    services: { ...EMPTY_ADD_PARKING_SERVICES },
  }
}

export function loadAddParkingDraft(): AddParkingDraft {
  if (typeof window === 'undefined') {
    return createEmptyAddParkingDraft()
  }

  const rawDraft = window.localStorage.getItem(ADD_PARKING_STORAGE_KEY)

  if (!rawDraft) {
    return createEmptyAddParkingDraft()
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<AddParkingDraft>

    return {
      address: parsedDraft.address ?? '',
      capacity: parsedDraft.capacity ?? '',
      latitude:
        typeof parsedDraft.latitude === 'number' ? parsedDraft.latitude : null,
      longitude:
        typeof parsedDraft.longitude === 'number' ? parsedDraft.longitude : null,
      photos: Array.isArray(parsedDraft.photos) ? parsedDraft.photos : [],
      services: {
        ...EMPTY_ADD_PARKING_SERVICES,
        ...(parsedDraft.services ?? {}),
      },
    }
  } catch {
    return createEmptyAddParkingDraft()
  }
}
