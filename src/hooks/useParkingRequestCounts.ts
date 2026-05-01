import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { countParkingRequestsByStatus } from '../services/parkingService'
import { getSupabaseClient } from '../lib/supabase'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function useParkingRequestCounts(searchQuery: string) {
  const abortControllerRef = useRef<AbortController | null>(null)
  const channelId = useId().replace(/:/g, '-')
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [requestCounts, setRequestCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  })

  const loadRequestCounts = useCallback(async (nextSearchQuery: string) => {
    abortControllerRef.current?.abort()

    const abortController = new AbortController()
    abortControllerRef.current = abortController
    setIsLoading(true)

    try {
      const nextRequestCounts = await countParkingRequestsByStatus(
        nextSearchQuery,
        abortController.signal,
      )

      setRequestCounts(nextRequestCounts)
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
      void loadRequestCounts(searchQuery)
    }, 150)

    return () => {
      window.clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [loadRequestCounts, searchQuery])

  useEffect(() => {
    const client = getSupabaseClient()
    const channel = client
      .channel(`parking-request-counts-realtime-${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parkings',
        },
        () => {
          void loadRequestCounts(searchQuery)
        },
      )
      .subscribe()

    return () => {
      void client.removeChannel(channel)
    }
  }, [channelId, loadRequestCounts, searchQuery])

  return { error, isLoading, requestCounts }
}
