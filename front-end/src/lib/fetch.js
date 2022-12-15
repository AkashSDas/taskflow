export async function fetchFromAPI(URL, options) {
  try {
    let response = await fetch(
      `${import.meta.env.BACKEND_URL}/${URL}`,
      options
    );
    var data = await response.json();
    var success = response.status >= 200 && response.status < 300;
  } catch (err) {
    var error = err;
    var success = false;
  }

  return { data, error, success };
}
