import
  {
    addTokenToHttpClient,
    getSessionData,
  } from '@/src/store/ducks/authentication.duck'
import config from '../../config'
import request from '../utils/request'

export const baseURL = config.API_AUTH_BASE_URL

function handleErrors(response) {
  if (response.non_field_errors) {
    setTimeout(() => alert(response.non_field_errors[0]), 1000)
    throw Error(response.non_field_errors[0])
  }
  return response
}

export async function fetchIssueList(page = 1) {
  try {
    return await getIssues(page)
  } catch (error) {
    console.error('Error syncing issues:', error)
  }
}

export async function getIssues(page = 1) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/reporter/`
  const requestOptions = {
    url,
    method: 'GET',
    params: {page: page.toString(), page_size: '10'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })

    const jsonData = response.data
    return jsonData // Return the full response object with pagination info
  } catch (error) {
    console.error('Error at fetching issues from remote', error.message)
  }
}

export async function getIssueDetail(id) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/${id}/`
  const requestOptions = {
    url,
    method: 'GET',
  }

  try {
    const response = await request({
      ...requestOptions,
    })

    return response.data
  } catch (error) {
    console.error('Error at fetching issue from remote', error.message)
  }
}

export async function createIssue(payload) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/create/`

  console.log(payload)

  const requestOptions = {
    url,
    method: 'POST',
    data: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })

    return response.data
  } catch (error) {
    console.error('Error creating issue', error.message)
    throw new Error(`Error creating issue ${error.message}`)
  }
}

export async function addIssueAttachment(id, formData) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/${id}/add-attachment/`
  const requestOptions = {
    url,
    method: 'POST',
    data: formData,
    headers: {'Content-Type': 'multipart/form-data'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })
    return response.data
  } catch (error) {
    console.error('Error adding issue attachment', error.message)
    throw new Error(`Error adding issue attachment ${error.message}`)
  }
}

export async function addIssueComment(id, payload) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/${id}/add-comment/`
  const requestOptions = {
    url,
    method: 'POST',
    data: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })
    return response.data
  } catch (error) {
    console.error('Error adding issue comment', error.message)
    throw new Error(`Error adding issue comment ${error.message}`)
  }
}

export async function listIssueComments(id, page = 1) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/${id}/comments/`
  const requestOptions = {
    url,
    method: 'GET',
    params: {page: page.toString(), page_size: '10'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })

    return response.data
  } catch (error) {
    console.error('Error at fetching issue comment from remote', error.message)
  }
}

export async function listIssueAttachments(id, page = 1) {
  const session = await getSessionData()
  addTokenToHttpClient(session)
  const url = `${baseURL}/issues/${id}/attachments/`
  const requestOptions = {
    url,
    method: 'GET',
    params: {page: page.toString(), page_size: '10'},
  }

  try {
    const response = await request({
      ...requestOptions,
    })
    return response.data
  } catch (error) {
    console.error(
      'Error at fetching issue attachment from remote',
      error.message,
    )
  }
}

// Backwards compatible aliases
export async function getIssueComments(id, page = 1) {
  return listIssueComments(id, page)
}

export async function getIssueAttachments(id, page = 1) {
  return listIssueAttachments(id, page)
}
