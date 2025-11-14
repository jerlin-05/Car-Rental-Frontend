import React, { useEffect, useState } from "react";
import api from "../../services/api";


export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [uRes, vRes] = await Promise.all([
                    api.get("/api/admin/users"),
                    api.get("/api/vehicles"),
                ]);
                setUsers(uRes.data.users || uRes.data);
                setVehicles(vRes.data.vehicles || vRes.data);
            } catch (err) {
                console.error("admin fetch error", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const deleteVehicle = async (id) => {
        if (!confirm("Delete this vehicle?")) return;
        try {
            setBusy(true);
            await api.delete(`/api/admin/vehicles/${id}`);
            setVehicles(prev => prev.filter(v => v._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete vehicle");
        } finally {
            setBusy(false);
        }
    };

    const changeRole = async (userId, role) => {
        try {
            setBusy(true);
            await api.patch(`/api/admin/users/${userId}/role`, { role });
            setUsers(prev => prev.map(u => (u._id === userId ? { ...u, role } : u)));
        } catch (err) {
            console.error(err);
            alert("Failed to update role");
        } finally {
            setBusy(false);
        }
    };

    if (loading) return <div className="container"><p>Loading admin data…</p></div>;

    return (
        <div className="container">
            <h2>Admin Panel</h2>

            <section className="card" style={{ marginBottom: 20 }}>
                <h3>Users</h3>
                {users.length === 0 ? <p>No users</p> : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {users.map(u => (
                            <div className="card" key={u._id} style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div><strong>{u.name}</strong> — {u.email}</div>
                                    <div style={{ color: "var(--muted)" }}>Role: {u.role}</div>
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {u.role !== "seller" && <button className="btn" disabled={busy} onClick={() => changeRole(u._id, "seller")}>Promote to seller</button>}
                                    {u.role === "seller" && <button className="btn" disabled={busy} onClick={() => changeRole(u._id, "user")}>Demote to user</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="card">
                <h3>Vehicles</h3>
                {vehicles.length === 0 ? <p>No vehicles</p> : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {vehicles.map(v => (
                            <div className="card" key={v._id} style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div><strong>{v.name}</strong> — {v.brand}</div>
                                    <div style={{ color: "var(--muted)" }}>₹{v.pricePerDay} / day</div>
                                </div>
                                <div>
                                    <button className="btn" disabled={busy} onClick={() => deleteVehicle(v._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
