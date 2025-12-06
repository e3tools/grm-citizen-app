import config from "../../config";

const baseURL = config.API_AUTH_BASE_URL || '';
export { baseURL };

function handleErrors(response)
{
  if (response.non_field_errors) {
    setTimeout(() => alert(response.non_field_errors[0]), 1000);
    throw Error(response.non_field_errors[0]);
  }
  return response;
}

export async function register(data) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data),
    };
    return fetch(`${baseURL}/authentication/register/`, requestOptions)
            .then(response => {
               return response.json().then(res => {
                    return res;
                })
            })
            .catch(error => {
                console.log('aq',error)
                throw(error);
            });

}

export async function fetchAuthCredentials(data) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(`${baseURL}/authentication/login/`, requestOptions)
      const result = handleErrors(response)      
      return await result.json();
    } catch (_error) {
      return { error: 'Failed to fetch authentication credentials' };
    }
  }

