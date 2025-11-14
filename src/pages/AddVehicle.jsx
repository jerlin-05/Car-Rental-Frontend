import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function AddVehicle() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [seats, setSeats] = useState(4);
  const [transmission, setTransmission] = useState("manual");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const seatsOptions = Array.from({ length: 13 }, (_, i) => i + 2); 

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!name || !brand || !pricePerDay) {
      setMsg("Name, brand and price are required.");
      return;
    }

    const payload = {
      name,
      brand,
      pricePerDay: Number(pricePerDay),
      fuelType,
      seats: Number(seats),
      transmission,
    };

    try {
      setLoading(true);
      const res = await api.post("/api/seller/vehicles", payload);
      if (res.data?.ok) {
        setMsg("Vehicle added successfully.");
        setTimeout(() => nav("/vehicles"), 700);
      } else {
        setMsg(res.data?.message || "Failed to add vehicle.");
      }
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 900, margin: "24px auto" }}>
        <h2>Add Vehicle</h2>
        <form onSubmit={submit}>
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <input className="input" placeholder="Price per day" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />

          <select className="select" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
            <option value="petrol">petrol</option>
            <option value="diesel">diesel</option>
            <option value="electric">electric</option>
            <option value="hybrid">hybrid</option>
          </select>

          <select className="select" value={seats} onChange={(e) => setSeats(e.target.value)}>
            {seatsOptions.map((s) => (
              <option key={s} value={s}>{s} seats</option>
            ))}
          </select>

          <select className="select" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
            <option value="manual">manual</option>
            <option value="automatic">automatic</option>
          </select>

          {msg && <div style={{ color: "#f59e0b", marginBottom: 8 }}>{msg}</div>}

          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Adding…" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}
