import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inr = (n) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(n || 0));

export default function Vehicles(){
  const [vehicles, setVehicles] = useState([]);
  const user  = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const r = await api.get("/api/vehicles");
      setVehicles(r.data.vehicles || r.data || []);
    } catch (err) {
      setVehicles([]);
      console.error(err);
    }
  };

  useEffect(()=>{ load(); }, []);

  const handleBook = (vehicleId) => {
    if (!user) {
      // redirect unauthenticated user to login/signup (as earlier)
      navigate("/login", { state: { next: `/checkout?id=${vehicleId}` } });
      return;
    }
    // authenticated -> go to checkout page with id
    navigate(`/checkout?id=${vehicleId}`);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{margin:'4px 0 12px'}}>Vehicles</h2>

        <div className="grid">
          {vehicles.map(v => (
            <div className="card veh-card" key={v._id}>
              <h3 style={{marginTop:0}}>{v.name}</h3>
              <div className="tags" style={{margin:"6px 0 10px"}}>
                <span className="tag">{v.brand}</span>
                <span className="tag">{v.fuelType}</span>
                <span className="tag">{v.seats} seats</span>
                <span className="tag">{v.transmission}</span>
              </div>
              <div style={{marginBottom:12}}><b>₹{inr(v.pricePerDay)}</b> / day</div>
              <button className="btn btn--primary" onClick={()=>handleBook(v._id)}>Book Now</button>
            </div>
          ))}
          {!vehicles.length && <p style={{color:"var(--muted)"}}>No vehicles yet.</p>}
        </div>
      </div>
    </div>
  );
}
