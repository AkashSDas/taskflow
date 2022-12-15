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

export async function getAllTask(accessToken) {
  var response = await fetchFromTask("", "get", null, accessToken);

  if (response.status == 200) {
    return { success: response.success, tasks: response.data.tasks };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
  };
}

export async function deleteTask(taskId, accessToken) {
  var response = await fetchFromTask(`/${taskId}`, "delete", null, accessToken);

  if (response.status == 200) {
    return { success: response.success, taskId: response.data.task._id };
  }

  return {
    success: response.success,
    error: response.error ?? response.data?.error,
  };
}
