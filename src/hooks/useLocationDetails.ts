import {useEffect, useState} from 'react'
// import {
//   getLocationDetailsParams,
//   LocationDetails,
// } from '../services/locationDetailsService'

type Error = {
  message: string
}

export function useLocationDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error>()
  // const [data, setData] = useState<LocationDetails>()

  const fetchLocationDetails = async () => {
    // const result: LocationDetails | undefined = await getLocationDetailsParams()
    // setIsLoading(false)
    // if (!result) {
    //   setError({message: 'Could not retrieve form parameters.'})
    //   return
    // }
    // setData(result)
  }

  useEffect(() => {
    fetchLocationDetails()
  }, [])

  return {
    isLoading,
    error,
    // data,
  }
}
