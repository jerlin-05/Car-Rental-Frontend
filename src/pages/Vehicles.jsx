import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inr = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    fuelType: "petrol",
    seats: 5,
    transmission: "manual",
    pricePerDay: 1000,
  });
  const { user } = useAuth();
  const nav = useNavigate(); // <-- MUST be inside component

  const load = async () => {
    try {
      const r = await api.get("/api/vehicles");
      setVehicles(r.data.vehicles || []);
    } catch {
      setVehicles([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/vehicles", form);
    setForm({
      name: "",
      brand: "",
      fuelType: "petrol",
      seats: 5,
      transmission: "manual",
      pricePerDay: 1000,
    });
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ margin: "4px 0 12px" }}>Vehicles</h2>

        {user && (user.role === "admin" || user.role === "seller") && (
          <form onSubmit={submit} className="card" style={{ marginBottom: 16 }}>
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}
            >
              <input
                className="input"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
              <select
                className="select"
                value={form.fuelType}
                onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              >
                <option>petrol</option>
                <option>diesel</option>
                <option>electric</option>
                <option>hybrid</option>
              </select>
              <input
                className="input"
                type="number"
                placeholder="Seats"
                value={form.seats}
                onChange={(e) =>
                  setForm({ ...form, seats: Number(e.target.value) })
                }
              />
              <select
                className="select"
                value={form.transmission}
                onChange={(e) =>
                  setForm({ ...form, transmission: e.target.value })
                }
              >
                <option>manual</option>
                <option>automatic</option>
              </select>
              <input
                className="input"
                type="number"
                placeholder="Price/Day"
                value={form.pricePerDay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pricePerDay: Number(e.target.value),
                  })
                }
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn--primary">Add Vehicle</button>
            </div>
          </form>
        )}

        <div className="grid">
          {vehicles.map((v) => (
            <div className="card" key={v._id}>
              <h3 style={{ marginTop: 0 }}>{v.name}</h3>
              <div className="tags" style={{ margin: "6px 0 10px" }}>
                <span className="tag">{v.brand}</span>
                <span className="tag">{v.fuelType}</span>
                <span className="tag">{v.seats} seats</span>
                <span className="tag">{v.transmission}</span>
              </div>
              <div>
                <b>₹{inr(v.pricePerDay)}</b> / day
              </div>

              <button
                className="btn btn--primary"
                style={{ marginTop: 12 }}
                onClick={() => nav(`/checkout?id=${v._id}`)}
              >
                Book Now
              </button>
            </div>
          ))}
          {!vehicles.length && (
            <p style={{ color: "var(--muted)" }}>No vehicles yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
