import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // ✅ start empty (no default admin creds)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const { login, loading } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const r = await login(email, password);
    if (r.ok) nav("/vehicles");
    else setMsg(r.message || "Login failed");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: "40px auto" }}>
        <h2>Login</h2>
        {/* prevent browser from autofilling old demo values */}
        <form onSubmit={submit} autoComplete="off">
          <input
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {msg && <div style={{ color: "#fca5a5", marginBottom: 8 }}>{msg}</div>}

          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
