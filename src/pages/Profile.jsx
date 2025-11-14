import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 700, margin: "24px auto" }}>
        <h2>Profile</h2>

        <label>Name</label>
        <input className="input" value={user.name} readOnly />

        <label>Email</label>
        <input className="input" value={user.email} readOnly />

        <label>Role</label>
        <input className="input" value={user.role} readOnly />

        <label>User ID</label>
        <input className="input" value={user.id || user._id} readOnly />

    
      </div>
    </div>
  );
}
