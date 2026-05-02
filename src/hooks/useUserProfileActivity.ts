import { useEffect, useRef, useState } from 'react'
import { listUserComplaints, listUserReviews } from '../services/parkingService'
import { getSupabaseClient, supabase } from '../lib/supabase'
import type { ParkingComplaint, ParkingReview } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useUserProfileActivity(userId: string | null) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const refreshTimeoutRef = useRef<number | null>(null)
  const [reviews, setReviews] = useState<ParkingReview[]>([])
  const [complaints, setComplaints] = useState<ParkingComplaint[]>([])
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    abortControllerRef.current?.abort()

    if (refreshTimeoutRef.current !== null) {
      window.clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }

    if (!userId) {
      setReviews([])
      setComplaints([])
      setError(null)
      setIsLoading(false)
      return
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    const loadActivity = async () => {
      try {
        const [nextReviews, nextComplaints] = await Promise.all([
          listUserReviews(userId, abortController.signal),
          listUserComplaints(userId, abortController.signal),
        ])

        setReviews(nextReviews)
        setComplaints(nextComplaints)
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
    }

    void loadActivity()

    const channel = supabase
      ? getSupabaseClient().channel(`user-profile-activity:${userId}`)
      : null

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current !== null) {
        window.clearTimeout(refreshTimeoutRef.current)
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        if (abortController.signal.aborted) {
          return
        }

        void loadActivity()
      }, 120)
    }

    channel
      ?.on(
        'postgres_changes',
        {
          event: '*',
          filter: `user_id=eq.${userId}`,
          schema: 'public',
          table: 'reviews',
        },
        scheduleRefresh,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          filter: `user_id=eq.${userId}`,
          schema: 'public',
          table: 'reports',
        },
        scheduleRefresh,
      )
      .subscribe()

    return () => {
      abortController.abort()
      if (refreshTimeoutRef.current !== null) {
        window.clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
      if (channel) {
        void getSupabaseClient().removeChannel(channel)
      }
    }
  }, [userId])

  return { complaints, error, isLoading, reviews }
}
