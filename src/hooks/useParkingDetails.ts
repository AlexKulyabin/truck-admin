import { useEffect, useRef, useState } from 'react'
import { getParkingDetails } from '../services/parkingService'
import type { ParkingDetailRecord } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingDetails(parkingId: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [details, setDetails] = useState<ParkingDetailRecord | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    getParkingDetails(parkingId)
      .then((nextDetails) => {
        if (abortController.signal.aborted) return
        setDetails(nextDetails)
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

  return { details, error, isLoading }
}
