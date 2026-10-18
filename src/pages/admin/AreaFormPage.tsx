import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Compass, ArrowLeft, Save, AlertCircle, MapPin } from "lucide-react";
import { createArea, getAreaById, getLocations, updateArea } from "../../services/adminService";
import type { LocationItem } from "../../types/admin";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { CustomSelect } from "../../components/CustomSelect";
import { FormSkeleton } from "../../components/Skeleton";

export const AreaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [areaName, setAreaName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setFetching(true);
        const locList = await getLocations();
        setLocations(locList);

        if (id) {
          const area = await getAreaById(id);
          if (area) {
            setAreaName(area.areaName);
            setLocationId(area.locationId);
          } else {
            setError("Area record not found.");
          }
        } else if (locList.length > 0) {
          setLocationId(locList[0].id);
        }
      } catch (err: any) {
        setError(getFriendlyErrorMessage(err));
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!areaName.trim()) {
      setError("Please provide an Area Name.");
      return;
    }
    if (!locationId) {
      setError("Please select a Location (Lookup).");
      return;
    }

    const selectedLoc = locations.find((l) => l.id === locationId);

    try {
      setLoading(true);
      if (isEdit && id) {
        await updateArea(id, {
          areaName: areaName.trim(),
          locationId,
          locationName: selectedLoc?.locationName || "",
          locationCode: selectedLoc?.locationCode || "",
        });
      } else {
        await createArea({
          areaName: areaName.trim(),
          locationId,
          locationName: selectedLoc?.locationName || "",
          locationCode: selectedLoc?.locationCode || "",
          isActive: true,
        });
      }
      navigate("/admin/areas");
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
          to="/admin/areas"
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
          <span>Back to Areas</span>
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
            <Compass size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--clr-brown)", margin: 0 }}>
              {isEdit ? "Edit Area" : "Add New Area"}
            </h1>
            <p style={{ fontSize: "0.825rem", color: "var(--txt-muted)", margin: 0, fontWeight: 700 }}>
              Map an area / delivery neighborhood under a parent location
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
            {/* Location (Lookup) */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="area-location-lookup">
                  <MapPin size={15} color="#F28C00" />
                  <span>Location ( Lookup )</span>
                </label>
                <span className="form-badge-req">Required</span>
              </div>
              {locations.length === 0 ? (
                <div style={{ padding: "0.85rem 1rem", background: "rgba(184, 66, 11, 0.08)", borderRadius: "12px", fontSize: "0.85rem", color: "var(--clr-accent)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertCircle size={18} />
                  <span>
                    No locations exist yet. Please{" "}
                    <Link to="/admin/locations/new" style={{ color: "var(--clr-brown)", fontWeight: 800 }}>
                      create a Location first
                    </Link>
                    .
                  </span>
                </div>
              ) : (
                <CustomSelect
                  id="area-location-lookup"
                  value={locationId}
                  onChange={(val) => setLocationId(val)}
                  placeholder="-- Select Parent Location --"
                  required
                  icon={<MapPin size={17} />}
                  options={locations.map((loc) => ({
                    value: loc.id,
                    label: `${loc.locationCode} • ${loc.locationName}`,
                    icon: <MapPin size={14} color="#F28C00" />
                  }))}
                />
              )}
              <span className="form-hint">
                Select which city or territory location this area falls into.
              </span>
            </div>

            {/* Area Name */}
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="area-name-input">
                  <Compass size={15} color="#F28C00" />
                  <span>Area Name</span>
                </label>
                <span className="form-badge-req">Required</span>
              </div>
              <div className="form-input-wrapper">
                <span className="form-input-icon">
                  <Compass size={17} />
                </span>
                <input
                  id="area-name-input"
                  type="text"
                  className="form-input has-icon"
                  placeholder="e.g. Anna Nagar, Indiranagar, Kilpauk"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  required
                />
              </div>
              <span className="form-hint">
                Neighborhood, ward, or delivery cluster name.
              </span>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn-surface"
                onClick={() => navigate("/admin/areas")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || locations.length === 0}
                style={{ justifyContent: "center" }}
              >
                {loading ? (
                  <div className="loading-spinner" style={{ width: "16px", height: "16px" }} />
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? "Update Area" : "Save Area"}</span>
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

