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
import AdminPanel from "./pages/admin/AdminPanel.jsx"; 

/* ---------- Navbar component ---------- */
function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className="nav">
      <div className="nav__inner container">
        <NavLink to="/" className="nav__brand">CarRental</NavLink>

        <nav className="nav__links">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>

          
          {user?.role === "seller" && (
            <NavLink to="/seller/add-vehicle" className={linkClass}>Add Vehicle</NavLink>
          )}

        
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin Panel</NavLink>
          )}
        </nav>

        <div className="nav__auth">
          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/signup" className={linkClass}>Signup</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className={linkClass}>{user.name || "Profile"}</NavLink>
              <button type="button" className="btn btn--primary" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------- App Shell ---------- */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />

         
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          
          <Route
            path="/seller/add-vehicle"
            element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
