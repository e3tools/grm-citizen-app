import config from '../../config'

const baseURL = config.API_AUTH_BASE_URL || ''
export {baseURL}

function handleErrors(response) {
  if (response.non_field_errors) {
    setTimeout(() => alert(response.non_field_errors[0]), 1000)
    throw Error(response.non_field_errors[0])
  }
  return response
}

export async function register(data) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
  }
  return fetch(`${baseURL}/authentication/register/`, requestOptions)
    .then(response => {
      return response.json().then(res => {
        return res
      })
    })
    .catch(error => {
      throw error
    })
}

export async function fetchAuthCredentials(data) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
  }
  return await fetch(`${baseURL}/authentication/login/`, requestOptions)
    .then(response => {
      return response.json().then(res => {
        return res
      })
    })
    .catch(error => {
      throw error
    })
}
