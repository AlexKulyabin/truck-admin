import { useEffect, useRef, useState } from 'react'
import { listParkingPhotos } from '../services/parkingService'
import type { ParkingPhoto } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingPhotos(parkingId: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [photos, setPhotos] = useState<ParkingPhoto[]>([])

  useEffect(() => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    listParkingPhotos(parkingId, abortController.signal)
      .then((nextPhotos) => {
        setPhotos(nextPhotos)
        setError(null)
      })
      .catch((nextError) => {
        if (!isAbortError(nextError)) {
          setError(nextError)
        }
      })
      .finally(() => {
        if (abortControllerRef.current === abortController) {
          setIsLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [parkingId])

  return { error, isLoading, photos }
}
