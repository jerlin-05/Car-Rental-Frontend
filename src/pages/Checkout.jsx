import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// currency helper
const inr = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

export default function Checkout() {
  const { search } = useLocation();
  const nav = useNavigate();
  const { user } = useAuth();
  const vehicleId = new URLSearchParams(search).get("id");

  const [vehicle, setVehicle] = useState(null);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(() =>
    new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [paying, setPaying] = useState(false);

  const days = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [startDate, endDate]);

  useEffect(() => {
    if (!vehicleId) return;
    (async () => {
      try {
        const r = await api.get(`/api/vehicles/${vehicleId}`);
        setVehicle(r.data.vehicle);
      } catch {
        setVehicle(null);
      }
    })();
  }, [vehicleId]);

  const handlePay = async () => {
    if (!user) return nav("/login");
    if (!vehicle) return;

    try {
      setPaying(true);
      const r = await api.post("/api/payments/create-session", {
        vehicleId,
        days,
        startDate,
        endDate,
      });
      if (r.data?.url) {
        window.location.href = r.data.url; // Redirect to Stripe Checkout
      }
    } catch (e) {
      console.error(e);
      alert("Failed to start payment.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2>Checkout</h2>

        {!vehicle ? (
          <p style={{ color: "var(--muted)" }}>Loading vehicle…</p>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{vehicle.name}</h3>
              <div className="tags" style={{ margin: "10px 0" }}>
                <span className="tag">{vehicle.brand}</span>
                <span className="tag">{vehicle.fuelType}</span>
                <span className="tag">{vehicle.seats} seats</span>
                <span className="tag">{vehicle.transmission}</span>
              </div>
              <div>
                <b>₹{inr(vehicle.pricePerDay)}</b> / day
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="nav__link" style={{ paddingLeft: 0 }}>
                  Start date
                </label>
                <input
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="nav__link" style={{ paddingLeft: 0 }}>
                  End date
                </label>
                <input
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div
              className="card"
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "var(--muted)" }}>
                  {days} day{days > 1 ? "s" : ""} × ₹{inr(vehicle.pricePerDay)}
                </div>
                <h3 style={{ margin: 0 }}>
                  Total: ₹{inr(days * Number(vehicle.pricePerDay))}
                </h3>
              </div>
              <button className="btn btn--primary" onClick={handlePay} disabled={paying}>
                {paying ? "Redirecting…" : "Pay Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
