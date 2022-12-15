import { fetchFromAPI } from "../lib/fetch";

function fetchFromTask(URL, method, data, accessToken) {
  return fetchFromAPI(`task/${URL}`, method, data, accessToken);
}

export async function createTask(title, accessToken) {
  var response = await fetchFromTask("", "post", { title }, accessToken);

  if (response.status == 201) {
    return { success: response.success, task: response.data.task };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
  };
}
