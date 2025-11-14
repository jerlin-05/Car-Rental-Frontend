import api from "../api.js";

export async function loginUser(email, password) {
  try {
    const res = await api.post("/api/auth/login", { email, password });

    const token = res?.data?.token || res?.data?.data?.token;
    if (!token) {
      return { ok: false, message: "No token returned from server" };
    }

    
    localStorage.setItem("token", token);



    return { ok: true, data: res.data };
  } catch (err) {
    console.error("login error", err);
    
    const message = err?.response?.data?.message || err?.response?.data || err.message || "Login failed";
    return { ok: false, message };
  }
}
