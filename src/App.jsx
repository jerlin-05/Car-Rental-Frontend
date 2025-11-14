import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AddVehicle from "./pages/AddVehicle.jsx";

/* ---------- Navbar ---------- */
<nav className="nav__links">
  <NavLink to="/" className={linkClass} end>
    Home
  </NavLink>

  <NavLink to="/vehicles" className={linkClass}>
    Vehicles
  </NavLink>

  {/* seller */}
  {user?.role === "seller" && (
    <NavLink to="/seller/add-vehicle" className={linkClass}>
      Add Vehicle
    </NavLink>
  )}

  {/* admin */}
  {user?.role === "admin" && (
    <NavLink to="/admin" className={linkClass}>
      Admin Panel
    </NavLink>
  )}
</nav>
/* ---------- App Shell ---------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />

          {/* public auth pages (hidden from navbar when logged in) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* protected pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
  
}
