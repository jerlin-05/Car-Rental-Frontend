import api from "../services/api.js";

export async function loginUser(email, password) {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    
    const token =
      res?.data?.token ||
      res?.data?.accessToken ||
      res?.data?.data?.token ||
      res?.data?.data?.accessToken;

    if (!token) {
      return { ok: false, message: "No token returned from server" };
    }

    
    localStorage.setItem("token", token);

    return { ok: true, data: res.data };

  } catch (err) {
    console.log("Login error:", err);

    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      "Invalid credentials";

    return { ok: false, message: msg };
  }
}
