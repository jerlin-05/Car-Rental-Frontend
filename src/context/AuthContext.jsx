
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js"; 

const AuthContext = createContext(null);

export function useAuth() {
  
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    
    (async () => {
      try {
        const res = await api.get("/api/auth/profile"); 
        setUser(res?.data?.user || res?.data || null);
      } catch (err) {
       
        localStorage.removeItem("token");
        setUser(null);
      }
    })();
  }, []);

  
  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });

    
      const token = res?.data?.token || res?.data?.data?.token;
      if (!token) {
        setLoading(false);
        return { ok: false, message: "No token returned from server" };
      }

      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

 
      let profile = null;
      try {
        const p = await api.get("/api/auth/profile");
        profile = p?.data?.user || p?.data || null;
      } catch (e) {
        profile = null;
      }

      setUser(profile);
      setLoading(false);
      return { ok: true, data: res.data, user: profile };
    } catch (err) {
      setLoading(false);
  
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      return { ok: false, message };
    }
  }


  async function signup(payload) {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", payload);
      setLoading(false);
      return { ok: true, data: res.data };
    } catch (err) {
      setLoading(false);
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Signup failed";
      return { ok: false, message };
    }
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
