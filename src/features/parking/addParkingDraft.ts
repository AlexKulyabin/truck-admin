export type AddParkingServiceKey =
  | 'gas'
  | 'hotel'
  | 'laundry'
  | 'recreation'
  | 'shop'
  | 'shower'

export type AddParkingDraftPhoto = {
  id: string | null
  isNew: boolean
  url: string
}

export type AddParkingDraft = {
  address: string
  capacity: string
  latitude: number | null
  longitude: number | null
  photos: AddParkingDraftPhoto[]
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
      photos: Array.isArray(parsedDraft.photos)
        ? parsedDraft.photos
            .map((photo) => {
              if (typeof photo === 'string') {
                return {
                  id: null,
                  isNew: true,
                  url: photo,
                }
              }

              if (
                typeof photo === 'object' &&
                photo !== null &&
                'url' in photo &&
                typeof photo.url === 'string'
              ) {
                return {
                  id:
                    'id' in photo && typeof photo.id === 'string'
                      ? photo.id
                      : null,
                  isNew:
                    'isNew' in photo && typeof photo.isNew === 'boolean'
                      ? photo.isNew
                      : false,
                  url: photo.url,
                }
              }

              return null
            })
            .filter((photo): photo is AddParkingDraftPhoto => photo !== null)
        : [],
      services: {
        ...EMPTY_ADD_PARKING_SERVICES,
        ...(parsedDraft.services ?? {}),
      },
    }
  } catch {
    return createEmptyAddParkingDraft()
  }
}
