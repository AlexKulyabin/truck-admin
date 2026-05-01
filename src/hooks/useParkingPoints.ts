import { useCallback, useState } from 'react'
import { createParkingPoint } from '../services/parkingService'
import type { CreateParkingPointInput } from '../types/parking'

export function useParkingPoints() {
  const [error, setError] = useState<unknown>(null)
  const [isLoading] = useState(false)

  const addParkingPoint = useCallback(
    async (parkingPoint: CreateParkingPointInput) => {
      const createdPoint = await createParkingPoint(parkingPoint)

      setError(null)

      return createdPoint
    },
    [],
  )

  return { addParkingPoint, error, isLoading }
}
