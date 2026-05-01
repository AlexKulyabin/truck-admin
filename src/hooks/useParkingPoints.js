import { useCallback, useEffect, useState } from 'react'
import { createParkingPoint, listParkingPoints } from '../services/parkingService'

export function useParkingPoints() {
  const [parkingPoints, setParkingPoints] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    listParkingPoints()
      .then((points) => {
        if (isMounted) {
          setParkingPoints(points)
          setError(null)
        }
      })
      .catch((nextError) => {
        if (isMounted) {
          setError(nextError)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const addParkingPoint = useCallback(async (parkingPoint) => {
    const createdPoint = await createParkingPoint(parkingPoint)

    setParkingPoints((currentPoints) => [createdPoint, ...currentPoints])
    setError(null)

    return createdPoint
  }, [])

  return { addParkingPoint, error, parkingPoints, isLoading }
}
