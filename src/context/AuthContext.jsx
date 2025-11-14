import api from "../services/api.js";

export async function loginUser(email, password) {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    const token = res?.data?.token;

    if (!token) {
      return { ok: false, message: "No token from server" };
    }

    localStorage.setItem("token", token);

    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, message: "Invalid credentials" };
  }
}
