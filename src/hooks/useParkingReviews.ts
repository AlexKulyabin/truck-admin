import { useEffect, useRef, useState } from 'react'
import { getParkingReviewSummary, listParkingReviews } from '../services/parkingService'
import type { ParkingRatingSummary, ParkingReview } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

const EMPTY_SUMMARY: ParkingRatingSummary = {
  averageRating: null,
  reviewsCount: 0,
  starCounts: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
}

export function useParkingReviews(parkingId: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reviews, setReviews] = useState<ParkingReview[]>([])
  const [summary, setSummary] = useState<ParkingRatingSummary>(EMPTY_SUMMARY)

  useEffect(() => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    Promise.all([
      getParkingReviewSummary(parkingId, abortController.signal),
      listParkingReviews(parkingId, abortController.signal),
    ])
      .then(([nextSummary, nextReviews]) => {
        setSummary(nextSummary)
        setReviews(nextReviews)
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

  return { error, isLoading, reviews, summary }
}
