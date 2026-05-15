import { useEffect, useRef, useState } from 'react'
import { getParkingAuthor } from '../services/parkingService'
import type { ParkingAuthor } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

const EMPTY_AUTHOR: ParkingAuthor = {
  avatarUrl: null,
  fullName: null,
  id: null,
}

export function useParkingAuthor(parkingId: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [author, setAuthor] = useState<ParkingAuthor>(EMPTY_AUTHOR)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    getParkingAuthor(parkingId, abortController.signal)
      .then((nextAuthor) => {
        if (abortController.signal.aborted) return
        setAuthor(nextAuthor)
        setError(null)
      })
      .catch((nextError) => {
        if (!isAbortError(nextError)) {
          setError(nextError)
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      abortController.abort()
    }
  }, [parkingId])

  return { author, error, isLoading }
}
