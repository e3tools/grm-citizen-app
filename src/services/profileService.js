import config from "../../config";
import request from "../utils/request";
import {addTokenToHttpClient, getSessionData} from "../store/ducks/authentication.duck";

export const baseURL = config.API_AUTH_BASE_URL;

export async function fetchCitizenAgeGroups() {
  try {
    const url = `${baseURL}/issues/citizen-age-groups/`;
    const response = await request({
      url,
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching citizen age groups:', error);
    throw error;
  }
}

export async function fetchCitizenGroups() {
  try {
    const url = `${baseURL}/issues/citizen-groups/`;
    const response = await request({
      url,
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching citizen groups:', error);
    throw error;
  }
}

export async function fetchUserProfile(data) {
  try {
    const session = await getSessionData();
    addTokenToHttpClient(session);
    const url = `${baseURL}/authentication/citizen-detail/`;
    const response = await request({
      url,
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(data) {
  try {
    const session = await getSessionData();
    addTokenToHttpClient(session);
    const url = `${baseURL}/authentication/citizen-update/`;
    const response = await request({
      url,
      method: 'PATCH',
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

