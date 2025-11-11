import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ marginTop: 0 }}>Profile</h2>

        {!user ? (
          <p style={{ color: "#9ca3af" }}>No user info loaded.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
            <div className="kv">
              <span className="kv__label">Name</span>
              <span className="kv__value">{user.name}</span>
            </div>
            <div className="kv">
              <span className="kv__label">Email</span>
              <span className="kv__value">{user.email}</span>
            </div>
            <div className="kv">
              <span className="kv__label">Role</span>
              <span className="kv__value" style={{ color: "var(--brand)" }}>
                {user.role}
              </span>
            </div>
            <div className="kv">
              <span className="kv__label">User ID</span>
              <span className="kv__value" style={{ fontFamily: "monospace" }}>
                {user.id || user._id}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
