import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { getAreas, getLocations, deleteArea } from "../../services/adminService";
import type { AreaItem, LocationItem } from "../../types/admin";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { EmptyLocationIllustration } from "../../components/illustrations";
import { useConfirmDialog } from "../../components/ConfirmDialog";
import { CustomSelect } from "../../components/CustomSelect";
import { TableSkeleton } from "../../components/Skeleton";

export const AreasListPage: React.FC = () => {
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { confirm, ConfirmDialogRenderer } = useConfirmDialog();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [areaList, locList] = await Promise.all([getAreas(), getLocations()]);
      setAreas(areaList);
      setLocations(locList);
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
      title: "Delete Area",
      message: `Are you sure you want to delete area "${name}"?`,
      subMessage: "This will remove this area zone from delivery routing under its linked location hub.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteArea(id);
      setAreas((prev) => prev.filter((item) => item.id !== id));
      setSuccessMsg(`Area "${name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = areas.filter((area) => {
    const matchesLoc = selectedLocation === "all" || area.locationId === selectedLocation;
    const matchesSearch =
      area.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.locationName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (area.locationCode || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  return (
    <div className="app-container animate-fade-in" style={{ padding: "1.25rem 0.85rem 7.5rem", maxWidth: "980px", margin: "0 auto" }}>
      {/* Top Header & Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--txt-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>
            <Link to="/" style={{ color: "var(--clr-accent)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span>Super Admin</span>
            <span>/</span>
            <span style={{ color: "var(--clr-brown)" }}>Areas</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--clr-brown)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Compass size={26} color="#F28C00" />
            <span>Areas Management</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <button
            type="button"
            className="btn-surface"
            onClick={loadData}
            title="Refresh"
            disabled={loading}
            style={{ padding: "0.6rem 0.9rem" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/areas/new"
            className="btn-primary"
            style={{ padding: "0.6rem 1.1rem", textDecoration: "none" }}
          >
            <Plus size={18} />
            <span>Add Area</span>
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

      {/* Toolbar: Search & Location Lookup Filter */}
      <div
        className="game-card admin-toolbar-wrap"
        style={{
          padding: "1rem",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "180px", width: "100%" }}>
          <Search size={18} color="var(--txt-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Area Name or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>

        {/* Location Lookup Dropdown Filter */}
        <div style={{ width: "100%", maxWidth: "320px", flex: "1 1 220px" }}>
          <CustomSelect
            id="area-filter-location"
            value={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
            icon={<Filter size={16} />}
            options={[
              { value: "all", label: "All Locations (Lookup)" },
              ...locations.map((loc) => ({
                value: loc.id,
                label: `${loc.locationCode} • ${loc.locationName}`,
                icon: <MapPin size={14} color="#F28C00" />
              }))
            ]}
          />
        </div>

        <div className="admin-toolbar-stats" style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--clr-brown)" }}>
          Total Areas: <span style={{ color: "#F28C00" }}>{filtered.length}</span>
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
            No Areas Found
          </h3>
          <p style={{ color: "var(--txt-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
            {searchTerm || selectedLocation !== "all"
              ? "No areas matched the current filter."
              : "Create areas mapped under your locations to organize neighborhood delivery zones."}
          </p>
          <Link to="/admin/areas/new" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
            <Plus size={16} />
            <span>Add First Area</span>
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
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Area Name</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Location (Lookup)</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Status</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((area, idx) => (
                    <tr
                      key={area.id}
                      style={{
                        borderBottom: idx === filtered.length - 1 ? "none" : "1px solid var(--border-base)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(242, 140, 0, 0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "var(--clr-brown)" }}>
                        <span style={{ fontSize: "0.95rem" }}>{area.areaName}</span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--clr-accent)" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            background: "rgba(184, 66, 11, 0.07)",
                            padding: "0.3rem 0.65rem",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                          }}
                        >
                          <MapPin size={13} />
                          <span>{area.locationName || area.locationCode || "Linked Hub"}</span>
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
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
                            onClick={() => navigate(`/admin/areas/edit/${area.id}`)}
                            title="Edit Area"
                            style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => handleDelete(area.id, area.areaName)}
                            title="Delete Area"
                            disabled={deletingId === area.id}
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

          {/* Mobile Card View (<= 640px) */}
          <div className="admin-mobile-cards">
            {filtered.map((area) => (
              <div
                key={area.id}
                className="game-card"
                style={{
                  padding: "0.95rem 1rem",
                  borderRadius: "16px",
                  background: "#FFFFFF",
                  border: "1.5px solid var(--border-base)",
                  boxShadow: "0 2px 8px rgba(53, 23, 15, 0.05)",
                }}
              >
                {/* Top Row: Location Badge + Active Status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: "rgba(184, 66, 11, 0.08)",
                      color: "var(--clr-accent)",
                      fontWeight: 800,
                      fontSize: "12px",
                      padding: "3px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    <MapPin size={12} />
                    <span>{area.locationName || area.locationCode || "Hub"}</span>
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

                {/* Area Name */}
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--clr-brown)", marginBottom: "0.85rem", lineHeight: 1.3 }}>
                  {area.areaName}
                </div>

                {/* Bottom Row: Full-width Touch Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "0.6rem", borderTop: "1px dashed var(--border-base)" }}>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => navigate(`/admin/areas/edit/${area.id}`)}
                    style={{
                      flex: 1,
                      height: "44px",
                      fontSize: "0.875rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <Edit2 size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => handleDelete(area.id, area.areaName)}
                    disabled={deletingId === area.id}
                    style={{
                      flex: 1,
                      height: "44px",
                      fontSize: "0.875rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      color: "var(--clr-error)",
                      borderColor: "rgba(184, 11, 11, 0.2)",
                      borderRadius: "10px",
                    }}
                  >
                    <Trash2 size={15} />
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
