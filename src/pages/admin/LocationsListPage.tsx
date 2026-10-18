import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { getLocations, deleteLocation } from "../../services/adminService";
import type { LocationItem } from "../../types/admin";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { EmptyLocationIllustration } from "../../components/illustrations";
import { useConfirmDialog } from "../../components/ConfirmDialog";
import { TableSkeleton } from "../../components/Skeleton";

export const LocationsListPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { confirm, ConfirmDialogRenderer } = useConfirmDialog();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getLocations();
      setLocations(list);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirm({
      title: "Delete Location",
      message: `Are you sure you want to delete location "${name}"?`,
      subMessage: "This will permanently remove the hub and all associated settings from the system.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteLocation(id);
      setLocations((prev) => prev.filter((item) => item.id !== id));
      setSuccessMsg(`Location "${name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = locations.filter(
    (loc) =>
      loc.locationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container animate-fade-in" style={{ padding: "1.25rem 0.85rem 7.5rem", maxWidth: "980px", margin: "0 auto" }}>
      {/* Top Header & Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--txt-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>
            <Link to="/" style={{ color: "var(--clr-accent)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span>Super Admin</span>
            <span>/</span>
            <span style={{ color: "var(--clr-brown)" }}>Locations</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.35rem, 5vw, 1.75rem)", fontWeight: 900, color: "var(--clr-brown)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={24} color="#F28C00" />
            <span>Locations Management</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-surface"
            onClick={loadData}
            title="Refresh"
            disabled={loading}
            style={{ padding: "0.55rem 0.85rem", fontSize: "0.85rem" }}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/locations/new"
            className="btn-primary"
            style={{ padding: "0.55rem 1rem", textDecoration: "none", fontSize: "0.85rem" }}
          >
            <Plus size={16} />
            <span>Add Location</span>
          </Link>
        </div>
      </div>

      {/* Notice & Feedback */}
      {error && (
        <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)", marginBottom: "1.25rem" }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="notice-box" style={{ background: "rgba(26,110,66,0.12)", color: "#1A6E42", borderColor: "#1A6E42", marginBottom: "1.25rem" }}>
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Stats Toolbar */}
      <div
        className="game-card admin-toolbar-wrap"
        style={{
          padding: "0.85rem 1rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "180px", width: "100%" }}>
          <Search size={18} color="var(--txt-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Location Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>
        <div className="admin-toolbar-stats" style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--clr-brown)" }}>
          <span>Total Locations:</span>
          <span style={{ color: "#F28C00", marginLeft: "4px" }}>{filtered.length}</span>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <div className="game-card" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
          <div className="empty-illustration" style={{ margin: "0 auto 1.25rem" }}>
            <EmptyLocationIllustration width={220} height={160} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--clr-brown)", margin: "0 0 0.5rem" }}>
            No Locations Found
          </h3>
          <p style={{ color: "var(--txt-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
            {searchTerm ? "No locations matched your search criteria." : "Create your first delivery hub location to start linking areas and shops."}
          </p>
          <Link to="/admin/locations/new" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
            <Plus size={16} />
            <span>Add First Location</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View (>= 641px) */}
          <div className="admin-desktop-table game-card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "rgba(53, 23, 15, 0.05)", borderBottom: "1.5px solid var(--border-base)" }}>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Code</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Location Name</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Status</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((loc, idx) => (
                    <tr
                      key={loc.id}
                      style={{
                        borderBottom: idx === filtered.length - 1 ? "none" : "1px solid var(--border-base)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(242, 140, 0, 0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 900, color: "#B8420B" }}>
                        <span
                          style={{
                            background: "rgba(184, 66, 11, 0.08)",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "8px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {loc.locationCode}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "var(--clr-brown)" }}>
                        {loc.locationName}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            background: "rgba(26, 110, 66, 0.12)",
                            color: "#1A6E42",
                          }}
                        >
                          Active
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => navigate(`/admin/locations/edit/${loc.id}`)}
                            title="Edit Location"
                            style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => handleDelete(loc.id, loc.locationName)}
                            title="Delete Location"
                            disabled={deletingId === loc.id}
                            style={{
                              padding: "0.4rem 0.65rem",
                              fontSize: "0.8rem",
                              color: "var(--clr-error)",
                              borderColor: "rgba(184, 11, 11, 0.2)",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View (<= 640px) — Fits 100% of Any Mobile Screen */}
          <div className="admin-mobile-cards">
            {filtered.map((loc) => (
              <div
                key={loc.id}
                className="game-card"
                style={{
                  padding: "0.95rem 1rem",
                  borderRadius: "16px",
                  background: "#FFFFFF",
                  border: "1.5px solid var(--border-base)",
                  boxShadow: "0 2px 8px rgba(53, 23, 15, 0.05)",
                }}
              >
                {/* Top Row: Code Badge + Active Status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      background: "rgba(184, 66, 11, 0.08)",
                      color: "#B8420B",
                      fontWeight: 900,
                      fontSize: "12px",
                      padding: "3px 8px",
                      borderRadius: "8px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {loc.locationCode}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                      background: "rgba(26, 110, 66, 0.12)",
                      color: "#1A6E42",
                    }}
                  >
                    Active
                  </span>
                </div>

                {/* Location Name */}
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--clr-brown)", marginBottom: "0.85rem", lineHeight: 1.3 }}>
                  {loc.locationName}
                </div>

                {/* Bottom Row: Full-width Touch Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderTop: "1px dashed var(--border-base)", paddingTop: "0.65rem" }}>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => navigate(`/admin/locations/edit/${loc.id}`)}
                    style={{ flex: 1, justifyContent: "center", padding: "0.5rem", fontSize: "0.82rem" }}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => handleDelete(loc.id, loc.locationName)}
                    disabled={deletingId === loc.id}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      padding: "0.5rem",
                      fontSize: "0.82rem",
                      color: "var(--clr-error)",
                      borderColor: "rgba(184, 11, 11, 0.2)",
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Custom App Confirm Dialog */}
      <ConfirmDialogRenderer />
    </div>
  );
};
