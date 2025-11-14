import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setUser(res.data.user || res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      // re-fetch profile to populate user
      const pr = await api.get("/api/auth/profile");
      setUser(pr.data.user || pr.data);
      return { ok: true, ...(res.data || {}) };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      return { ok: false, message: msg };
    }
  };

  const signup = async (name, email, password, role = "user") => {
    try {
      const res = await api.post("/api/auth/signup", { name, email, password, role });
      return { ok: true, ...(res.data || {}) };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Signup failed";
      return { ok: false, message: msg };
    }
  };

  const logout = async () => {
    try { await api.post("/api/auth/logout"); } catch (e) {}
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
