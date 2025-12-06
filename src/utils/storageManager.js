import * as SecureStore from "expo-secure-store";

export const storeEncryptedData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (_e) {
    // saving error
  }
};

export const getEncryptedData = async (key) => {
  try {
    const jsonValue = await SecureStore.getItemAsync(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (_e) {
    // error reading value
  }
};

export const removeEncryptedValue = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (_e) {
    // remove error
  }
};
