import { fetchFromAPI } from "../lib/fetch";

function fetchFromAuth(URL, options) {
  return fetchFromAPI(`/auth/${URL}`, options);
}

export async function getNewAccessToken() {
  var response = await fetchFromAuth("access-token", { method: "GET" });
  if (response.status == 200) {
    return {
      success: response.success,
      user: response.data.user,
      accessToken: response.data.accessToken,
    };
  }

  return { success: response.success, error: response.error };
}
