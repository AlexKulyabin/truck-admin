import { useCallback, useEffect, useRef, useState } from 'react'
import { listFilteredParkingMapItems } from '../services/parkingService'
import type { ParkingMapItem, ParkingMapRequest } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingMapItems() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parkingItems, setParkingItems] = useState<ParkingMapItem[]>([])

  const loadParkingItems = useCallback(async (request: ParkingMapRequest) => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    try {
      const nextItems = await listFilteredParkingMapItems(
        request,
        abortController.signal,
      )

      setParkingItems(nextItems)
      setError(null)
    } catch (nextError) {
      if (!isAbortError(nextError)) {
        setError(nextError)
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return { error, isLoading, loadParkingItems, parkingItems }
}
