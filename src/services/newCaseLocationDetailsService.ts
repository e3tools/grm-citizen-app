import config from '../../config'
import request from '../utils/request'

const baseURL = config.API_AUTH_BASE_URL
export const getDistricts = async () => {
  const baseUrl = `${baseURL}/issues/regions/`
  let allResults: any[] = []
  let nextUrl: string | null = baseUrl

  try {
    while (nextUrl) {
      const requestOptions = {
        url: nextUrl,
        method: 'GET',
      }

      const response = await request({
        ...requestOptions,
      })

      if (response?.data?.results) {
        allResults = allResults.concat(response.data.results)
      }

      nextUrl = response?.data?.next || null
    }

    return allResults
  } catch (error) {
    return undefined
  }
}

export const getWards = async (id: number) => {
  const url = `${baseURL}/issues/region-children/?parent=${id}`
  const requestOptions = {
    url,
    method: 'GET',
  }

  try {
    const response = await request({
      ...requestOptions,
    })

    return response?.data ?? undefined
  } catch (error) {
    return undefined
  }
}
