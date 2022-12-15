export async function fetchFromAPI(URL, method, data, accessToken) {
  if (!URL || !method) throw new Error("URL and method are required");

  try {
    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${URL}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data && JSON.stringify(data),
      credentials: "include",
    });
    var data = await response.json();
    var success = response.status >= 200 && response.status < 300;
    var status = response.status;
  } catch (err) {
    var error = err;
    var success = false;
  }

  return { data, error, success, status: status ?? 500 };
}
