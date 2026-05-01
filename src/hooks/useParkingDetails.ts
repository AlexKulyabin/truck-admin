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

    getParkingDetails(parkingId)
      .then((nextDetails) => {
        setDetails(nextDetails)
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

  return { details, error, isLoading }
}
