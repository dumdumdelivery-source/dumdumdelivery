import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, Save, AlertCircle, Hash, Building2 } from "lucide-react";
import { createLocation, getLocationById, updateLocation } from "../../services/adminService";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { FormSkeleton } from "../../components/Skeleton";

export const LocationFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [locationCode, setLocationCode] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setFetching(true);
          const loc = await getLocationById(id);
          if (loc) {
            setLocationCode(loc.locationCode);
            setLocationName(loc.locationName);
          } else {
            setError("Location not found.");
          }
        } catch (err: any) {
          setError(getFriendlyErrorMessage(err));
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!locationCode.trim()) {
      setError("Please provide a Location Code (e.g., MAA-01).");
      return;
    }
    if (!locationName.trim()) {
      setError("Please enter the Location Name.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit && id) {
        await updateLocation(id, {
          locationCode: locationCode.trim().toUpperCase(),
          locationName: locationName.trim(),
        });
      } else {
        await createLocation({
          locationCode: locationCode.trim().toUpperCase(),
          locationName: locationName.trim(),
          isActive: true,
        });
      }
      navigate("/admin/locations");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: "1.25rem 0.85rem 7.5rem", maxWidth: "600px", margin: "0 auto", boxSizing: "border-box" }}>
      {/* Back button */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          to="/admin/locations"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--clr-accent)",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "0.85rem",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Locations</span>
        </Link>
      </div>

      <div className="game-card" style={{ padding: "1.75rem", background: "#FFFFFF", borderRadius: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background: "rgba(242, 140, 0, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F28C00",
              flexShrink: 0,
            }}
          >
            <MapPin size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--clr-brown)", margin: 0 }}>
              {isEdit ? "Edit Location" : "Add New Location"}
            </h1>
            <p style={{ fontSize: "0.825rem", color: "var(--txt-muted)", margin: 0, fontWeight: 700 }}>
              Configure a delivery territory / hub for DumDum Delivery
            </p>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border-base)", margin: "1.25rem 0" }} />

        {error && (
          <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)", marginBottom: "1.25rem" }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {fetching ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Location Code */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="location-code-input">
                  <Hash size={15} color="#F28C00" />
                  <span>Location Code</span>
                </label>
                <span className="form-badge-req">Required</span>
              </div>
              <div className="form-input-wrapper">
                <span className="form-input-icon">
                  <Hash size={17} />
                </span>
                <input
                  id="location-code-input"
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. MAA-01, BLR-01, CBE-01"
                  value={locationCode}
                  onChange={(e) => setLocationCode(e.target.value.toUpperCase())}
                  required
                  maxLength={15}
                  style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 800 }}
                />
              </div>
              <span className="form-hint">
                Standard territory code used for order routing, logistics tracking & invoicing.
              </span>
            </div>

            {/* Location Name */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="location-name-input">
                  <Building2 size={15} color="#F28C00" />
                  <span>Location Name</span>
                </label>
                <span className="form-badge-req">Required</span>
              </div>
              <div className="form-input-wrapper">
                <span className="form-input-icon">
                  <MapPin size={17} />
                </span>
                <input
                  id="location-name-input"
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. Chennai Metropolitan, Bangalore Urban"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                />
              </div>
              <span className="form-hint">
                Official city or hub name displayed to customers and merchants.
              </span>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn-surface"
                onClick={() => navigate("/admin/locations")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ justifyContent: "center" }}
              >
                {loading ? (
                  <div className="loading-spinner" style={{ width: "16px", height: "16px" }} />
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? "Update Location" : "Save Location"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

