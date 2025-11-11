import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("user"); // user or seller
  const [msg,setMsg] = useState("");
  const { signup, loading } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    const r = await signup(name, email, password, role);
    if (r.ok) { setMsg("Signup successful. Please login."); setTimeout(()=>nav("/login"), 800); }
    else setMsg(r.message);
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:460, margin:"24px auto"}}>
        <h2 style={{margin:'4px 0 12px'}}>Signup</h2>
        <form onSubmit={submit}>
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
          {msg && <div style={{color:"#065f46", marginTop:6}}>{msg}</div>}
          <div style={{marginTop:10}}><button className="btn btn--primary" disabled={loading}>{loading ? "Submitting…" : "Create account"}</button></div>
        </form>
      </div>
    </div>
  );
}
