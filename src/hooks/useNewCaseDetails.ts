import {useEffect, useState} from 'react'
import {
  getNewCaseDetailsParams,
  NewCaseDetails,
} from '../services/newCaseDetailsService'

type Error = {
  message: string
}

export function useNewCaseDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [data, setData] = useState<NewCaseDetails>()

  const fetchNewCaseDetails = async () => {
    const result: NewCaseDetails | undefined = await getNewCaseDetailsParams()
    setIsLoading(false)
    if (!result) {
      setError({message: 'Could not retrieve form parameters.'})
      return
    }
    setData(result)
  }

  useEffect(() => {
    fetchNewCaseDetails()
  }, [])

  return {
    isLoading,
    error,
    data,
  }
}
