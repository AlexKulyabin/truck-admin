import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { listParkingRequests } from '../services/parkingService'
import { getSupabaseClient } from '../lib/supabase'
import type { ParkingRequestItem } from '../types/parking'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingRequests(searchQuery: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const channelId = useId().replace(/:/g, '-')
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [parkingRequests, setParkingRequests] = useState<ParkingRequestItem[]>([])

  const loadParkingRequests = useCallback(async (nextSearchQuery: string) => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    try {
      const nextParkingRequests = await listParkingRequests(
        nextSearchQuery,
        abortController.signal,
      )

      setParkingRequests(nextParkingRequests)
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
      void loadParkingRequests(searchQuery)
    }, 150)

    return () => {
      window.clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [loadParkingRequests, searchQuery])

  useEffect(() => {
    const client = getSupabaseClient()
    const channel = client
      .channel(`parking-requests-realtime-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parkings',
        },
        () => {
          void loadParkingRequests(searchQuery)
        },
      )
      .subscribe()

    return () => {
      void client.removeChannel(channel)
    }
  }, [channelId, loadParkingRequests, searchQuery])

  return { error, isLoading, parkingRequests }
}
