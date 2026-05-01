import { useEffect, useRef, useState } from 'react'
import { listParkingComplaints } from '../services/parkingService'
import type { ParkingComplaint } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingComplaints(parkingId: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [complaints, setComplaints] = useState<ParkingComplaint[]>([])
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    listParkingComplaints(parkingId, abortController.signal)
      .then((nextComplaints) => {
        setComplaints(nextComplaints)
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

  return { complaints, error, isLoading }
}
