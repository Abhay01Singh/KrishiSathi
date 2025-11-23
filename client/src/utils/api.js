export const API_URL = "http://localhost:3000";

export const api = async (url, method = "GET", body = null, token = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) options.headers.Authorization = token;
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${url}`, options);
  return res.json();
};
