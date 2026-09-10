const API_URL = import.meta.env.VITE_API_URL; // e.g. https://bacbok-api.onrender.com

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    // FastAPI validation errors come back as an array in `detail`
    const message = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg).join(", ")
      : data.detail || "Something went wrong";
    throw new Error(message);
  }
  return data;
}

export async function signup({ firstName, lastName, email, username, password, confirmPassword }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,
      confirm_password: confirmPassword,
    }),
  });
  return handleResponse(res);
}

export async function login({ identifier, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem("token", data.access_token); // store the JWT for later requests
  return data;
}

export async function forgotPassword({ email }) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function resetPassword({ token, newPassword, confirmPassword }) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  });
  return handleResponse(res);
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}