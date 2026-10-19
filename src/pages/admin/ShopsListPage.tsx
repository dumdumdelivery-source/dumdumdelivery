import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  MapPin,
  Phone,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  Filter,
  Star
} from "lucide-react";
import { getShops, getLocations, deleteShop } from "../../services/adminService";
import type { ShopItem, LocationItem } from "../../types/admin";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { EmptyShopIllustration } from "../../components/illustrations";
import { useConfirmDialog } from "../../components/ConfirmDialog";
import { CustomSelect } from "../../components/CustomSelect";
import { TableSkeleton } from "../../components/Skeleton";

export const ShopsListPage: React.FC = () => {
  const [shops, setShops] = useState<ShopItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<ShopItem | null>(null);
  const navigate = useNavigate();
  const { confirm, ConfirmDialogRenderer } = useConfirmDialog();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [shopList, locList] = await Promise.all([getShops(), getLocations()]);
      setShops(shopList);
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
      title: "Delete Shop Partner",
      message: `Are you sure you want to delete shop "${name}"?`,
      subMessage: "This will remove the merchant record, registration reference, and commercial configuration.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!ok) return;

    try {
      setDeletingId(id);
      await deleteShop(id);
      setShops((prev) => prev.filter((item) => item.id !== id));
      setSuccessMsg(`Shop "${name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = shops.filter((shop) => {
    const matchesLoc = selectedLocation === "all" || shop.locationId === selectedLocation;
    const matchesSearch =
      shop.shopLegalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.reqNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.ownerMobileNumber || "").includes(searchTerm) ||
      (shop.locationName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLoc && matchesSearch;
  });

  return (
    <div className="app-container animate-fade-in" style={{ padding: "1.25rem 0.85rem 7.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Top Header & Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--txt-muted)", marginBottom: "0.25rem", fontWeight: 700 }}>
            <Link to="/" style={{ color: "var(--clr-accent)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span>Super Admin</span>
            <span>/</span>
            <span style={{ color: "var(--clr-brown)" }}>Shops</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--clr-brown)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building2 size={26} color="#F28C00" />
            <span>Shops Management</span>
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
            to="/admin/shops/new"
            className="btn-primary"
            style={{ padding: "0.6rem 1.1rem", textDecoration: "none" }}
          >
            <Plus size={18} />
            <span>Add Shop</span>
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

      {/* Toolbar: Search and Location Filter */}
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
            placeholder="Search by Legal Name, Req No, Owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>

        {/* Location Lookup Dropdown Filter */}
        <div style={{ width: "100%", maxWidth: "320px", flex: "1 1 220px" }}>
          <CustomSelect
            id="shop-filter-location"
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
          Total Shops: <span style={{ color: "#F28C00" }}>{filtered.length}</span>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <div className="game-card" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
          <div className="empty-illustration" style={{ margin: "0 auto 1.25rem" }}>
            <EmptyShopIllustration width={220} height={160} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--clr-brown)", margin: "0 0 0.5rem" }}>
            No Shops Found
          </h3>
          <p style={{ color: "var(--txt-muted)", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
            {searchTerm || selectedLocation !== "all"
              ? "No shop partners matched your search."
              : "Register your bakery and sweet shop partners with legal details and payment terms."}
          </p>
          <Link to="/admin/shops/new" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
            <Plus size={16} />
            <span>Add First Shop</span>
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
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)" }}>Shop Legal Name & Req No</th>
                    <th style={{ padding: "0.85rem 1rem", fontWeight: 900, color: "var(--clr-brown)" }}>Owner & Contact</th>
                    <th style={{ padding: "0.85rem 1rem", fontWeight: 900, color: "var(--clr-brown)" }}>Location (Lookup)</th>
                    <th style={{ padding: "0.85rem 1rem", fontWeight: 900, color: "var(--clr-brown)" }}>Commercials</th>
                    <th style={{ padding: "0.85rem 1rem", fontWeight: 900, color: "var(--clr-brown)" }}>Rating</th>
                    <th style={{ padding: "0.85rem 1.25rem", fontWeight: 900, color: "var(--clr-brown)", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((shop, idx) => (
                    <tr
                      key={shop.id}
                      style={{
                        borderBottom: idx === filtered.length - 1 ? "none" : "1px solid var(--border-base)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(242, 140, 0, 0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Legal Name & Req No */}
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "10px",
                              background: "rgba(242, 140, 0, 0.1)",
                              border: "1.5px solid var(--border-base)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {shop.imageUrl ? (
                              <img
                                src={shop.imageUrl}
                                alt={shop.shopLegalName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <Building2 size={18} color="#F28C00" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 900, color: "var(--clr-brown)", fontSize: "0.95rem" }}>
                              {shop.shopLegalName}
                            </div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 800, color: "#B8420B", marginTop: "3px" }}>
                              <span style={{ background: "rgba(184, 66, 11, 0.08)", padding: "1px 6px", borderRadius: "6px" }}>
                                {shop.reqNo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner & Contacts */}
                      <td style={{ padding: "1rem 1rem" }}>
                        <div style={{ fontWeight: 800, color: "var(--clr-brown)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <User size={13} color="#F28C00" />
                          <span>{shop.ownerName}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--txt-muted)", fontWeight: 700, marginTop: "2px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Phone size={11} />
                          <span>{shop.ownerMobileNumber}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td style={{ padding: "1rem 1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            background: "rgba(184, 66, 11, 0.07)",
                            padding: "0.3rem 0.65rem",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            color: "var(--clr-accent)",
                          }}
                        >
                          <MapPin size={13} />
                          <span>{shop.locationName || "Mapped Hub"}</span>
                        </span>
                      </td>

                      {/* Commercials: Fee % and Min Order */}
                      <td style={{ padding: "1rem 1rem" }}>
                        <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--clr-brown)" }}>
                          Fee: <span style={{ color: "#F28C00" }}>{shop.paymentPercentage}%</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--txt-muted)", fontWeight: 700, marginTop: "2px" }}>
                          Min Order: ₹{shop.minimumOrderAmount}
                        </div>
                      </td>

                      {/* Rating */}
                      <td style={{ padding: "1rem 1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            background: "rgba(242, 140, 0, 0.12)",
                            color: "#B8420B",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: 900,
                          }}
                        >
                          <Star size={12} color="#F28C00" fill="#F28C00" />
                          <span>{shop.rating !== undefined ? Number(shop.rating).toFixed(1) : "4.8"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => setViewShop(shop)}
                            title="View Complete Record"
                            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => navigate(`/admin/shops/edit/${shop.id}`)}
                            title="Edit Shop"
                            style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
                          >
                            <Edit2 size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-surface"
                            onClick={() => handleDelete(shop.id, shop.shopLegalName)}
                            title="Delete Shop"
                            disabled={deletingId === shop.id}
                            style={{
                              padding: "0.4rem 0.6rem",
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
            {filtered.map((shop) => (
              <div
                key={shop.id}
                className="game-card"
                style={{
                  padding: "0.95rem 1rem",
                  borderRadius: "16px",
                  background: "#FFFFFF",
                  border: "1.5px solid var(--border-base)",
                  boxShadow: "0 2px 8px rgba(53, 23, 15, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {/* Top Badges Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        background: "rgba(184, 66, 11, 0.08)",
                        color: "#B8420B",
                        fontWeight: 900,
                        fontSize: "11px",
                        padding: "2px 7px",
                        borderRadius: "6px",
                      }}
                    >
                      {shop.reqNo}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        background: "rgba(242, 140, 0, 0.1)",
                        color: "var(--clr-accent)",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: "6px",
                      }}
                    >
                      <MapPin size={11} />
                      <span>{shop.locationName || "Hub"}</span>
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.2rem",
                        background: "rgba(242, 140, 0, 0.12)",
                        color: "#B8420B",
                        fontSize: "11px",
                        fontWeight: 900,
                        padding: "2px 7px",
                        borderRadius: "6px",
                      }}
                    >
                      <Star size={10} color="#F28C00" fill="#F28C00" />
                      <span>{shop.rating !== undefined ? Number(shop.rating).toFixed(1) : "4.8"}</span>
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: "6px",
                      background: "rgba(26, 110, 66, 0.12)",
                      color: "#1A6E42",
                    }}
                  >
                    Fee {shop.paymentPercentage}%
                  </span>
                </div>

                {/* Shop Legal Name & Image */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "rgba(242, 140, 0, 0.1)",
                      border: "1.5px solid var(--border-base)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {shop.imageUrl ? (
                      <img
                        src={shop.imageUrl}
                        alt={shop.shopLegalName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Building2 size={20} color="#F28C00" />
                    )}
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--clr-brown)", lineHeight: 1.25 }}>
                    {shop.shopLegalName}
                  </div>
                </div>

                {/* Owner & Phone details */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.825rem", color: "var(--txt-muted)", fontWeight: 700 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--clr-brown)" }}>
                    <User size={13} color="#F28C00" />
                    <span>{shop.ownerName}</span>
                  </span>
                  <a
                    href={`tel:${shop.ownerMobileNumber}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--clr-accent)", textDecoration: "none" }}
                  >
                    <Phone size={12} />
                    <span>{shop.ownerMobileNumber}</span>
                  </a>
                </div>

                {/* Bottom Row: Full-width Touch Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "0.5rem", borderTop: "1px dashed var(--border-base)" }}>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => setViewShop(shop)}
                    style={{
                      flex: 1,
                      height: "42px",
                      padding: "0 0.4rem",
                      fontSize: "0.825rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => navigate(`/admin/shops/edit/${shop.id}`)}
                    style={{
                      flex: 1,
                      height: "42px",
                      padding: "0 0.4rem",
                      fontSize: "0.825rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-surface"
                    onClick={() => handleDelete(shop.id, shop.shopLegalName)}
                    disabled={deletingId === shop.id}
                    style={{
                      flex: 1,
                      height: "42px",
                      padding: "0 0.4rem",
                      fontSize: "0.825rem",
                      fontWeight: 800,
                      justifyContent: "center",
                      color: "var(--clr-error)",
                      borderColor: "rgba(184, 11, 11, 0.2)",
                      borderRadius: "10px",
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

      {/* Modal View for Detailed Shop Record */}
      {viewShop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(53, 23, 15, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setViewShop(null)}
        >
          <div
            className="game-card"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "1.75rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <span
                  style={{
                    background: "rgba(184, 66, 11, 0.08)",
                    color: "var(--clr-accent)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 900,
                  }}
                >
                  REQ NO: {viewShop.reqNo}
                </span>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--clr-brown)", margin: "0.35rem 0 0" }}>
                  {viewShop.shopLegalName}
                </h2>
              </div>
              <button
                type="button"
                className="btn-surface"
                onClick={() => setViewShop(null)}
                style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
              >
                ✕
              </button>
            </div>

            {viewShop.imageUrl && (
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "1rem",
                  border: "1.5px solid var(--border-base)",
                }}
              >
                <img
                  src={viewShop.imageUrl}
                  alt={viewShop.shopLegalName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1rem" }}>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Owner Name</span>
                <strong style={{ color: "var(--clr-brown)" }}>{viewShop.ownerName}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Location (Lookup)</span>
                <strong style={{ color: "var(--clr-brown)" }}>{viewShop.locationName || "—"}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Shop Tel</span>
                <strong style={{ color: "var(--clr-brown)" }}>{viewShop.shopTelNumber || "—"}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Owner Mobile</span>
                <strong style={{ color: "var(--clr-brown)" }}>{viewShop.ownerMobileNumber}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Payment Mobile</span>
                <strong style={{ color: "var(--clr-brown)" }}>{viewShop.paymentMobileNumber}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Commission & Min Order</span>
                <strong style={{ color: "#F28C00" }}>{viewShop.paymentPercentage}% • Min ₹{viewShop.minimumOrderAmount}</strong>
              </div>
              <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px", gridColumn: "span 2" }}>
                <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700 }}>Customer Rating</span>
                <strong style={{ color: "var(--clr-accent)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Star size={14} color="#F28C00" fill="#F28C00" />
                  <span>{viewShop.rating !== undefined ? Number(viewShop.rating).toFixed(1) : "4.8"} / 5.0</span>
                </strong>
              </div>
            </div>

            <div style={{ background: "rgba(53,23,15,0.03)", padding: "0.75rem", borderRadius: "10px", marginBottom: "1.25rem", fontSize: "0.85rem" }}>
              <span style={{ fontSize: "11px", color: "var(--txt-muted)", display: "block", fontWeight: 700, marginBottom: "0.2rem" }}>Detailed Address</span>
              <p style={{ margin: 0, color: "var(--clr-brown)", lineHeight: 1.45, fontWeight: 600 }}>{viewShop.detailedAddress}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const targetId = viewShop.id;
                  setViewShop(null);
                  navigate(`/admin/shops/edit/${targetId}`);
                }}
              >
                <Edit2 size={16} />
                <span>Edit Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom App Confirm Dialog */}
      <ConfirmDialogRenderer />
    </div>
  );
};
