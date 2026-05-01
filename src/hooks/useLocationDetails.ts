import { useEffect, useState } from 'react'
import { getDistricts, getWards } from '../services/newCaseLocationDetailsService'
import { getEncryptedData, storeEncryptedData } from '../utils/storageManager'

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
  hierarchical_name: string
}

export function useLocationDetails() {
  const [areDistrictsLoading, setAreDistrictsLoading] = useState(true)
  const [areWardsLoading, setAreWardsLoading] = useState(false)
  const [areWardChildrenLoading, setAreWardChildrenLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [districts, setDistricts] = useState<Region[] | undefined>()
  const [wardLevels, setWardLevels] = useState<Region[][]>([])

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
    setWardLevels([])
    const result: any[] | undefined = await getWards(id)
    setAreWardsLoading(false)
    if (!result) {
      setError({message: 'Could not retrieve form parameters.'})
      return
    }
    setWardLevels([result])
  }

  const clearWardLevelsFrom = (level: number) => {
    setWardLevels(prev => prev.slice(0, level + 1))
  }

  const fetchWardChildren = async (id: number, level: number) => {
    setAreWardChildrenLoading(true)
    const result: any[] | undefined = await getWards(id)
    setAreWardChildrenLoading(false)
    if (!result || result.length === 0) {
      setWardLevels(prev => prev.slice(0, level + 1))
      return
    }

    setWardLevels(prev => {
      const next = prev.slice(0, level + 1)
      next[level + 1] = result
      return next
    })
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
    areWardChildrenLoading,
    error,
    districts,
    wardLevels,
    fetchWards,
    fetchWardChildren,
    clearWardLevelsFrom,
  }
}
