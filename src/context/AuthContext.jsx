import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) { setAuthToken(t); me(); }
  }, []);

  const me = async () => {
    try {
      const r = await api.get("/api/auth/profile");
      setUser(r.data.user);
    } catch {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const r = await api.post("/api/auth/login", { email, password });
      const t = r.data.token;
      localStorage.setItem("token", t);
      setAuthToken(t);
      await me();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role="user") => {
    setLoading(true);
    try {
      await api.post("/api/auth/signup", { name, email, password, role });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch {}
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </Ctx.Provider>
  );
}
