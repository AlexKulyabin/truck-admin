import { useCallback, useEffect, useRef, useState } from 'react'
import { listReviewParkingItems } from '../services/parkingService'
import type { ParkingListItem } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingReviewParkings(searchQuery: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parkingItems, setParkingItems] = useState<ParkingListItem[]>([])

  const loadParkingItems = useCallback(async (nextSearchQuery: string) => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    try {
      const nextParkingItems = await listReviewParkingItems(
        nextSearchQuery,
        abortController.signal,
      )

      setParkingItems(nextParkingItems)
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
    const timeoutId = window.setTimeout(() => {
      void loadParkingItems(searchQuery)
    }, 150)

    return () => {
      window.clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [loadParkingItems, searchQuery])

  return { error, isLoading, parkingItems }
}
