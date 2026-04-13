import {useEffect, useState} from 'react'
import {getDistricts, getWards} from '../services/newCaseLocationDetailsService'
import {getEncryptedData, storeEncryptedData} from '../utils/storageManager'

type Error = {
  message: string
}

type Region = {
  id: number
  administrative_level: number
  created_date: string
  name: string
  parent: number
  updated_date: string
}

export function useLocationDetails() {
  const [areDistrictsLoading, setAreDistrictsLoading] = useState(true)
  const [areWardsLoading, setAreWardsLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [districts, setDistricts] = useState<Region[] | undefined>()
  const [wards, setWards] = useState<Region[] | undefined>()

  const fetchDistricts = async () => {
    const result: any[] | undefined = await getDistricts()

    setAreDistrictsLoading(false)
    if (!result) {
      setError({message: 'Could not retrieve form parameters.'})
      return
    }
    setDistricts(result)
    await storeEncryptedData('districts', result)
  }

  const fetchWards = async (id: number) => {
    setAreWardsLoading(true)
    const result: any[] | undefined = await getWards(id)
    setAreWardsLoading(false)
    if (!result) {
      setError({message: 'Could not retrieve form parameters.'})
      return
    }
    setWards(result)
  }

  useEffect(() => {
    const loadDistricts = async () => {
      const cachedDistricts = await getEncryptedData('districts')
      if (cachedDistricts) {
        setDistricts(cachedDistricts)
        setAreDistrictsLoading(false)
      } else {
        await fetchDistricts()
      }
    }
    loadDistricts()
  }, [])

  return {
    areDistrictsLoading,
    areWardsLoading,
    error,
    districts,
    wards,
    fetchWards,
  }
}
