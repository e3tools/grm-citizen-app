import config from '../../config'
import request from '../utils/request'

const baseURL = config.API_AUTH_BASE_URL

type BaseListResponseType = {
  count: number
  next: string
  prev: string
  results: any[]
}

export type NewCaseDetails = {
  components: BaseListResponseType
  subcomponents: BaseListResponseType
  categories: BaseListResponseType
  types: BaseListResponseType
  subtypes: BaseListResponseType
}

export const getIssueComponents = async () => {
  const url = `${baseURL}/issues/components/`
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
    console.error('Error Fetching Issue Components', error.message)
    return
  }
}

export const getIssueCategories = async () => {
  const url = `${baseURL}/issues/issue-categories/`
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
    console.error('Error Fetching Issue Categories', error.message)
    return
  }
}

export const getIssueSubTypes = async () => {
  const url = `${baseURL}/issues/issue-subtypes/`
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
    console.error('Error Fetching Issue Subtypes', error.message)
    return
  }
}

export const getIssueTypes = async () => {
  const url = `${baseURL}/issues/issue-types/`
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
    console.error('Error Fetching Issue Types', error.message)
    return
  }
}

export const getIssueSubcomponents = async () => {
  const url = `${baseURL}/issues/subcomponents/`
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
    console.error('Error Fetching Issue Subcomponents', error.message)
    return
  }
}

export async function getNewCaseDetailsParams(): Promise<
  NewCaseDetails | undefined
> {
  const components = await getIssueComponents()
  const subcomponents = await getIssueSubcomponents()
  const categories = await getIssueCategories()
  const types = await getIssueTypes()
  const subtypes = await getIssueSubTypes()

  if (!components || !subcomponents || !categories || !types || !subtypes) {
    return
  }

  return {
    components,
    subcomponents,
    categories,
    types,
    subtypes,
  }
}
