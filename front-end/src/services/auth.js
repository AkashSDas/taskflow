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

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
  };
}

export async function login(data) {
  var response = await fetchFromAuth("login", "post", data);

  if (response.status == 200) {
    return {
      success: response.success,
      user: response.data.user,
      accessToken: response.data.accessToken,
      message: response.data.message,
    };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
    message: response.data?.message,
  };
}

export async function logout() {
  var response = await fetchFromAuth("logout", "get");

  if (response.status == 200) {
    return {
      success: response.success,
      message: response.data.message,
    };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
    message: response.data?.message,
  };
}

export async function signup(data) {
  var response = await fetchFromAuth("signup", "post", data);

  if (response.status == 20) {
    return {
      success: response.success,
      user: response.data.user,
      accessToken: response.data.accessToken,
      message: response.data.message,
    };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
    message: response.data?.message,
  };
}
