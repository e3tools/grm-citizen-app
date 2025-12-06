import config from "../../config";
import request, { client } from "../utils/request";
import {addTokenToHttpClient, getSessionData} from "@/src/store/ducks/authentication.duck";

export const baseURL = config.API_AUTH_BASE_URL;

function handleErrors(response)
{
  if (response.non_field_errors) {
    setTimeout(() => alert(response.non_field_errors[0]), 1000);
    throw Error(response.non_field_errors[0]);
  }
  return response;
}


export async function fetchIssueList(page = 1) {

  try {
    return await getIssues(page);
  } catch (error) {
    console.error('Error syncing issues:', error);
  }
}
export async function getIssues(page = 1) {
    const session = await getSessionData();
    addTokenToHttpClient(session);
    const url = `${baseURL}/issues/reporter/`;
    const requestOptions = {
      url,
      method: 'GET',
      params: { page: page.toString(), page_size: '10' },
    };

    try {
      const response = await request({
        ...requestOptions,
      });

      const jsonData = response.data;
      return jsonData; // Return the full response object with pagination info
    } catch (error) {
      console.error("Error at fetching issues from remote", error.message);
    }
}