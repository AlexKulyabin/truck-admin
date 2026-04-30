import { useEffect, useState } from 'react'
import { listParkingPoints } from '../services/parkingService'

export function useParkingPoints() {
  const [parkingPoints, setParkingPoints] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    listParkingPoints()
      .then((points) => {
        if (isMounted) {
          setParkingPoints(points)
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

  return { parkingPoints, isLoading }
}
