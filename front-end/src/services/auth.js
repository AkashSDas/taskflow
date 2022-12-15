import { fetchFromAPI } from "../lib/fetch";

function fetchFromAuth(URL, method, data, accessToken) {
  return fetchFromAPI(`auth/${URL}`, method, data, accessToken);
}

export async function getNewAccessToken() {
  var response = await fetchFromAuth("access-token", "get");
  if (response.status == 200) {
    return {
      success: response.success,
      user: response.data.user,
      accessToken: response.data.accessToken,
    };
  }

  return { success: response.success, error: response.error };
}

export async function login(data) {
  var response = await fetchFromAuth("login", "post", data);

  if (response.status == 200) {
    return {
      success: response.success,
      user: response.data.user,
      accessToken: response.data.accessToken,
    };
  }

  return { success: response.success, error: response.error };
}
