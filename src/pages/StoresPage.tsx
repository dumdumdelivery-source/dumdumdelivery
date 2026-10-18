import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Store as StoreIcon,
  Construction,
  Hammer,
  ChevronRight,
  HardHat,
  Cone,
  MapPin,
  ChevronDown,
  Check,
  X,
  Search
} from "lucide-react";
import { getLocations, getShops } from "../services/adminService";
import { fetchStores, extractLocationsFromStores } from "../services/storeService";
import { useSettings } from "../context/SettingsContext";
import { EmptyLocationIllustration } from "../components/illustrations";
import { StoresTrailSkeleton } from "../components/Skeleton";
import type { LocationItem } from "../types/admin";
import type { Store } from "../types";

interface TreeItem {
  icon: string;
  size: string;
  top: number;
  left: number;
  zIndex?: number;
  opacity?: number;
}

const TreeCluster: React.FC<{
  top: string;
  left?: string;
  right?: string;
  trees: TreeItem[];
  width?: number;
  height?: number;
}> = ({ top, left, right, trees, width = 76, height = 42 }) => {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: "none",
        zIndex: 5,
        userSelect: "none",
      }}
    >
      {/* Soft ground turf shadow under the tree grove */}
      <div
        style={{
          position: "absolute",
          bottom: "2px",
          left: "10%",
          width: "80%",
          height: "14px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(168, 120, 80, 0.15) 0%, rgba(168, 120, 80, 0) 75%)",
          filter: "blur(2px)",
        }}
      />
      {/* Group of trees in grove */}
      {trees.map((t, idx) => (
        <span
          key={idx}
          style={{
            position: "absolute",
            top: `${t.top}px`,
            left: `${t.left}px`,
            fontSize: t.size,
            zIndex: t.zIndex ?? idx + 1,
            opacity: t.opacity ?? 0.9,
            filter: "drop-shadow(0 2px 4px rgba(53, 23, 15, 0.15))",
            lineHeight: 1,
            display: "inline-block",
            transform: `rotate(${((idx % 2) === 0 ? -1 : 1) * 2}deg)`,
          }}
        >
          {t.icon}
        </span>
      ))}
    </div>
  );
};

export const StoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [selectedSite, setSelectedSite] = useState<number | null>(null);

  // Stores & Locations fetched strictly from DB
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<LocationItem[]>(() => {
    try {
      const raw = localStorage.getItem("dumdum_admin_locations_cache");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return [];
  });
  // Do NOT pre-select location initially
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [sheetOffsetY, setSheetOffsetY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartYRef = React.useRef(0);
  const currentDragYRef = React.useRef(0);

  const closeBottomSheet = () => {
    setIsDropdownOpen(false);
    setLocationSearch("");
    setSheetOffsetY(0);
    setIsDraggingSheet(false);
  };

  const handleDragStart = (clientY: number) => {
    dragStartYRef.current = clientY;
    currentDragYRef.current = clientY;
    setIsDraggingSheet(true);
  };

  useEffect(() => {
    if (!isDraggingSheet) return;

    const handleWindowMove = (clientY: number) => {
      currentDragYRef.current = clientY;
      const deltaY = clientY - dragStartYRef.current;
      if (deltaY > 0) {
        setSheetOffsetY(deltaY);
      } else {
        setSheetOffsetY(0);
      }
    };

    const handleWindowEnd = () => {
      setIsDraggingSheet(false);
      const deltaY = currentDragYRef.current - dragStartYRef.current;
      if (deltaY > 70) {
        closeBottomSheet();
      } else {
        setSheetOffsetY(0);
      }
    };

    const onMouseMove = (e: MouseEvent) => handleWindowMove(e.clientY);
    const onMouseUp = () => handleWindowEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleWindowMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleWindowEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDraggingSheet]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [locList, storeList, shopList] = await Promise.all([
          getLocations(),
          fetchStores(),
          getShops()
        ]);

        // Use strictly DB locations from getLocations()
        if (locList && locList.length > 0) {
          setLocations(locList);
        } else {
          // If no locations collection, extract only from actual DB stores if any
          const actualStoreLocations = storeList.filter(s => !s.id.startsWith("fallback-store-"));
          const extracted = extractLocationsFromStores(actualStoreLocations);
          setLocations(extracted);
        }

        // Map admin shops to Store interface so partner shops appear seamlessly
        const mappedAdminShops: Store[] = shopList.map((shop) => {
          const loc = locList.find((l) => l.id === shop.locationId);
          return {
            id: shop.id,
            name: shop.shopLegalName,
            slug:
              shop.shopLegalName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || shop.id,
            description: shop.detailedAddress || "DumDum partner store",
            imageUrl:
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            isActive: shop.status !== "inactive",
            rating: typeof shop.rating === "number" ? shop.rating : 4.8,
            locationId: shop.locationId,
            locationName: shop.locationName || loc?.locationName || "",
            locationCode: loc?.locationCode || "",
            location: loc
              ? {
                  id: loc.id,
                  locationId: loc.id,
                  locationCode: loc.locationCode,
                  locationName: loc.locationName,
                }
              : undefined,
          };
        });

        // Merge: Filter out fallback stores if actual stores or admin shops exist
        const hasRealStores =
          storeList.some((s) => !s.id.startsWith("fallback-store-")) ||
          mappedAdminShops.length > 0;

        const baseStores = hasRealStores
          ? storeList.filter((s) => !s.id.startsWith("fallback-store-"))
          : storeList;

        // Deduplicate by id
        const mergedMap = new Map<string, Store>();
        baseStores.forEach((s) => mergedMap.set(s.id, s));
        mappedAdminShops.forEach((s) => mergedMap.set(s.id, s));

        setStores(Array.from(mergedMap.values()));
      } catch (e) {
        console.error("Error fetching locations and stores from DB:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || null;

  // Curve positions along the winding tar road trail
  const CURVE_POSITIONS = [
    { top: "13.5%", left: "26%", icon: HardHat },
    { top: "31.5%", left: "74%", icon: HardHat },
    { top: "49.5%", left: "26%", icon: Hammer },
    { top: "67.5%", left: "74%", icon: Cone },
  ];

  // Stores matching the selected location (lookup in store object)
  const matchingStores = selectedLocation
    ? stores.filter((s) => {
        const storeLocCode = (s.locationCode || s.location?.locationCode || "").trim().toUpperCase();
        const selLocCode = (selectedLocation.locationCode || "").trim().toUpperCase();
        const matchesCode = Boolean(storeLocCode && selLocCode && storeLocCode === selLocCode);

        const storeLocId = s.locationId || s.location?.id || s.location?.locationId || "";
        const matchesId = Boolean(storeLocId && selectedLocation.id && storeLocId === selectedLocation.id);

        const storeLocName = (s.locationName || s.location?.locationName || "").trim().toLowerCase();
        const selLocName = (selectedLocation.locationName || "").trim().toLowerCase();
        const matchesName = Boolean(storeLocName && selLocName && storeLocName === selLocName);

        return matchesCode || matchesId || matchesName;
      })
    : [];

  // Trail Items:
  // If records exist, show matching stores, followed by 3 coming soon stores.
  // If no records exist, show 3 coming soon stores only.
  const trailItems: Array<{ type: "active" | "coming_soon"; store?: Store; soonIndex?: number }> = [
    ...matchingStores.map((store) => ({ type: "active" as const, store })),
    { type: "coming_soon" as const, soonIndex: 1 },
    { type: "coming_soon" as const, soonIndex: 2 },
    { type: "coming_soon" as const, soonIndex: 3 },
  ];

  const handleOpenStore = (storeSlug: string) => {
    navigate(`/?store=${storeSlug}`);
  };

  return (
    <div
      className="stores-page-wrapper non-scrollable-page"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: "calc(70px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        background: "var(--bg-app)",
        fontFamily: "var(--font-game)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 1,
        boxSizing: "border-box",
      }}
    >
      <div
        className="app-container"
        style={{
          maxWidth: "540px",
          width: "100%",
          height: "100%",
          position: "relative",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: selectedLocation ? "flex-start" : "space-evenly",
          boxSizing: "border-box",
          padding: selectedLocation ? "0.5rem 1rem 0.5rem" : "1.25rem 1rem",
          overflow: "hidden",
        }}
      >
        {/* ── Fixed Location Selector Input (Pinned below Header) ── */}
        <div
          id="stores-location-dropdown-container"
          style={{
            position: "relative",
            zIndex: 40,
            background: "var(--bg-app)",
            paddingBottom: selectedLocation ? "0.6rem" : "0",
            flexShrink: 0,
          }}
        >
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            style={{
              background: "#FFFFFF",
              borderRadius: "28px",
              padding: "0.6rem 1.25rem 0.6rem 0.75rem",
              border: selectedLocation ? "1.5px solid #F0E3D3" : "1.5px solid #F28C00",
              boxShadow: "0 4px 18px rgba(53, 23, 15, 0.04)",
              animation: selectedLocation ? "none" : "locationAttentionPulse 2.4s infinite ease-in-out",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.2s ease",
            }}
          >
            {/* Left squircle icon with soft peach background */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "16px",
                background: "#FCECD9",
                color: "#35170F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={22} color="#35170F" strokeWidth={2.8} />
            </div>

            {/* Middle text block: LOCATION / STORES ARE SHOWING FROM and Location Name (Code) */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#B8420B",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  marginBottom: "3px",
                }}
              >
                {selectedLocation ? t("storesShowingFrom") : t("location")}
              </div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "15px",
                  color: selectedLocation ? "#2B140D" : "#8C6D62",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedLocation
                  ? selectedLocation.locationCode
                    ? `${selectedLocation.locationName} (${selectedLocation.locationCode})`
                    : selectedLocation.locationName
                  : t("chooseLocation")}
              </div>
            </div>

            {/* Right Chevron Down */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "4px" }}>
              <ChevronDown
                size={18}
                color="#8C6D62"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <StoresTrailSkeleton />
        ) : !selectedLocation ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <div
              id="stores-empty-location-view"
              className="game-card"
              style={{
                maxWidth: "460px",
                width: "100%",
                background: "#FFFFFF",
                borderRadius: "28px",
                border: "1.5px solid #F0E3D3",
                boxShadow: "0 10px 30px rgba(53, 23, 15, 0.06)",
                padding: "clamp(1.5rem, 3.5vh, 2.25rem) clamp(1.25rem, 4vw, 2rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                margin: "auto",
                boxSizing: "border-box",
              }}
            >
              <div
                className="empty-illustration"
                style={{
                  maxWidth: "clamp(160px, 24vh, 220px)",
                  width: "100%",
                  margin: "0 auto clamp(0.75rem, 1.8vh, 1.25rem)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ transform: "scale(clamp(0.8, 0.9, 1))", transformOrigin: "center center" }}>
                  <EmptyLocationIllustration />
                </div>
              </div>

              <span
                style={{
                  display: "inline-block",
                  background: "rgba(242, 140, 0, 0.12)",
                  color: "#B8420B",
                  fontSize: "11px",
                  fontWeight: 900,
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(0.4rem, 1vh, 0.65rem)",
                }}
              >
                {t("locationRequired")}
              </span>

              <h3
                style={{
                  fontSize: "clamp(1.25rem, 2.5vh, 1.55rem)",
                  fontWeight: 900,
                  color: "var(--clr-brown)",
                  margin: "0 0 0.35rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("chooseYourLocation")}
              </h3>
              <p
                style={{
                  fontSize: "clamp(0.825rem, 1.7vh, 0.925rem)",
                  color: "var(--txt-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                  maxWidth: "340px",
                }}
              >
                {t("chooseLocalArea")}
              </p>
            </div>
          </div>
        ) : (
          <div
            id="stores-road-scroll-container"
            style={{
              flex: 1,
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              borderRadius: "28px",
              paddingBottom: "1.5rem",
              boxSizing: "border-box",
            }}
          >
            <div
              className="winding-road-canvas"
              style={{
                position: "relative",
                width: "100%",
                height: "1080px",
                overflow: "hidden",
                borderRadius: "28px",
                background: "radial-gradient(ellipse at 50% 18%, rgba(255, 243, 220, 0.7) 0%, rgba(255, 235, 205, 0.3) 100%)",
                border: "1.5px solid rgba(232, 217, 198, 0.6)",
                boxShadow: "inset 0 2px 12px rgba(53, 23, 15, 0.04)",
              }}
            >
              {/* ══════════════════════════════════════════════════════════════
              SUBTLE SCENIC TREE ACCENTS ALONGSIDE THE ROAD
              ══════════════════════════════════════════════════════════════ */}


              {/* Curve 2: Left Open Meadow Bend */}
              <TreeCluster
                top="260px"
                left="20px"
                width={74}
                height={42}
                trees={[
                  { icon: "🌲", size: "1.6rem", top: 0, left: 6, zIndex: 1 },
                  { icon: "🌳", size: "1.75rem", top: 4, left: 32, zIndex: 2 },
                ]}
              />

              {/* Curve 3: Right Roadside Accent */}
              <TreeCluster
                top="450px"
                right="22px"
                width={72}
                height={42}
                trees={[
                  { icon: "🌳", size: "1.75rem", top: 2, left: 4, zIndex: 2 },
                  { icon: "🌲", size: "1.5rem", top: 0, left: 32, zIndex: 1 },
                ]}
              />

              {/* Curve 4: Lower Left Mountain Bend */}
              <TreeCluster
                top="645px"
                left="22px"
                width={72}
                height={42}
                trees={[
                  { icon: "🌲", size: "1.65rem", top: 0, left: 6, zIndex: 1 },
                  { icon: "🌳", size: "1.7rem", top: 4, left: 30, zIndex: 2 },
                ]}
              />



              {/* ── SVG Winding Curvy Tar Road ───────────────────────────── */}
              <svg
                viewBox="0 0 540 1080"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <defs>
                  {/* Tar Road Asphalt Gradient */}
                  <linearGradient id="tar-surface-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2E2420" />
                    <stop offset="25%" stopColor="#231B18" />
                    <stop offset="50%" stopColor="#2A201C" />
                    <stop offset="75%" stopColor="#1E1613" />
                    <stop offset="100%" stopColor="#291F1A" />
                  </linearGradient>

                  {/* Road Shoulder / Outer Border */}
                  <filter id="road-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#35170F" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Road Gravel Outer Bed / Shoulder */}
                <path
                  d="M 230, 68
                 C 185, 78, 140, 105, 140, 146
                 C 140, 239, 400, 247, 400, 340
                 C 400, 434, 140, 441, 140, 535
                 C 140, 629, 400, 636, 400, 730
                 C 400, 825, 270, 835, 270, 955"
                  stroke="#54443C"
                  strokeWidth="68"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#road-drop-shadow)"
                />

                {/* Dark Tar Road Surface */}
                <path
                  d="M 230, 68
                 C 185, 78, 140, 105, 140, 146
                 C 140, 239, 400, 247, 400, 340
                 C 400, 434, 140, 441, 140, 535
                 C 140, 629, 400, 636, 400, 730
                 C 400, 825, 270, 835, 270, 955"
                  stroke="url(#tar-surface-grad)"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Inner Asphalt Texture Line */}
                <path
                  d="M 230, 68
                 C 185, 78, 140, 105, 140, 146
                 C 140, 239, 400, 247, 400, 340
                 C 400, 434, 140, 441, 140, 535
                 C 140, 629, 400, 636, 400, 730
                 C 400, 825, 270, 835, 270, 955"
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="48"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* ── White Paint Center Road Markings ── */}
                <path
                  d="M 230, 68
                 C 185, 78, 140, 105, 140, 146
                 C 140, 239, 400, 247, 400, 340
                 C 400, 434, 140, 441, 140, 535
                 C 140, 629, 400, 636, 400, 730
                 C 400, 825, 270, 835, 270, 955"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeDasharray="14 14"
                  strokeLinecap="butt"
                  opacity="0.95"
                />
              </svg>

              {/* ══════════════════════════════════════════════════════════════
              DYNAMIC TRAIL NODES: MATCHING STORES + 3 COMING SOON STORES
              ══════════════════════════════════════════════════════════════ */}
              {trailItems.map((item, index) => {
                const curve = CURVE_POSITIONS[index % CURVE_POSITIONS.length];
                const isComingSoon = item.type === "coming_soon";
                const store = item.store;
                const shopNum = index + 1;
                const paddedShopNum = shopNum < 10 ? `0${shopNum}` : `${shopNum}`;

                if (!isComingSoon && store) {
                  // Active Store Node
                  return (
                    <div
                      key={`active-store-${store.id || index}`}
                      className="store-node-wrapper"
                      style={{
                        position: "absolute",
                        top: curve.top,
                        left: curve.left,
                        transform: "translate(-50%, -50%)",
                        zIndex: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenStore(store.slug)}
                    >
                      {/* Store Circle Image with Glowing Pulse */}
                      <div
                        className="store-active-circle"
                        style={{
                          position: "relative",
                          width: "92px",
                          height: "92px",
                          borderRadius: "50%",
                          padding: "3px",
                          background: "linear-gradient(135deg, #F5A020 0%, #D97B00 100%)",
                          boxShadow: "0 0 0 4px rgba(242, 140, 0, 0.45), 0 12px 28px rgba(242, 140, 0, 0.4)",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.08)";
                          e.currentTarget.style.boxShadow = "0 0 0 6px #F28C00, 0 16px 36px rgba(242, 140, 0, 0.55)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 0 0 4px rgba(242, 140, 0, 0.45), 0 12px 28px rgba(242, 140, 0, 0.4)";
                        }}
                      >
                        <img
                          src={store.imageUrl || "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"}
                          alt={store.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                            display: "block",
                            border: "2.5px solid #FFFFFF",
                          }}
                        />

                        {/* Floating Live Badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-8px",
                            background: "#1A6E42",
                            color: "#FFFFFF",
                            fontSize: "9px",
                            fontWeight: 900,
                            padding: "2px 7px",
                            borderRadius: "9999px",
                            boxShadow: "0 2px 8px rgba(26, 110, 66, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            border: "1.5px solid #FFFFFF",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4EFA9D" }} />
                          <span>{t("openNow")}</span>
                        </div>
                      </div>

                      {/* Store Card Info */}
                      <div
                        style={{
                          marginTop: "0.6rem",
                          background: "#FFFFFF",
                          border: "2px solid #F28C00",
                          borderRadius: "20px",
                          padding: "0.5rem 0.85rem",
                          boxShadow: "0 6px 18px rgba(53, 23, 15, 0.12)",
                          textAlign: "center",
                          maxWidth: "155px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "12px",
                            fontWeight: 900,
                            color: "var(--clr-brown)",
                            margin: 0,
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {store.name}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.3rem",
                            fontSize: "10.5px",
                            fontWeight: 800,
                            color: "#B8420B",
                            marginTop: "2px",
                          }}
                        >
                          <span>★ {store.rating || 4.9}</span>
                        </div>
                        <div
                          style={{
                            marginTop: "4px",
                            fontSize: "9px",
                            fontWeight: 900,
                            color: "#F28C00",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "2px",
                          }}
                        >
                          <span>{t("enterStore")}</span>
                          <ChevronRight size={10} />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Coming Soon Node
                const IconComponent = curve.icon;
                return (
                  <div
                    key={`coming-soon-${index}`}
                    className="store-node-wrapper"
                    style={{
                      position: "absolute",
                      top: curve.top,
                      left: curve.left,
                      transform: "translate(-50%, -50%)",
                      zIndex: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedSite(item.soonIndex || 1)}
                  >
                    {/* Construction Circle */}
                    <div
                      style={{
                        position: "relative",
                        width: "84px",
                        height: "84px",
                        borderRadius: "50%",
                        background: "repeating-linear-gradient(45deg, #35170F, #35170F 8px, #5A2A1A 8px, #5A2A1A 16px)",
                        border: "3px dashed #B87400",
                        boxShadow: "0 8px 20px rgba(53, 23, 15, 0.25)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.06)";
                        e.currentTarget.style.borderColor = "#F28C00";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.borderColor = "#B87400";
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "rgba(242, 140, 0, 0.20)",
                          border: "1.5px solid rgba(242, 140, 0, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#F28C00",
                        }}
                      >
                        <IconComponent size={22} />
                      </div>

                      {/* Mini Site Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          background: "#B87400",
                          color: "#FFFFFF",
                          fontSize: "8.5px",
                          fontWeight: 900,
                          padding: "2px 6px",
                          borderRadius: "9999px",
                          border: "1.5px solid #FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <Construction size={10} />
                        <span>SHOP {paddedShopNum}</span>
                      </div>
                    </div>

                    {/* Round Badge: COMING SOON without dummy name */}
                    <div
                      style={{
                        marginTop: "0.55rem",
                        background: "rgba(255, 252, 245, 0.95)",
                        border: "1.5px dashed rgba(184, 116, 0, 0.6)",
                        borderRadius: "18px",
                        padding: "0.45rem 0.85rem",
                        boxShadow: "0 4px 14px rgba(53, 23, 15, 0.08)",
                        textAlign: "center",
                        minWidth: "115px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: "linear-gradient(135deg, #B87400 0%, #F28C00 100%)",
                          color: "#FFFFFF",
                          fontSize: "9px",
                          fontWeight: 900,
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          letterSpacing: "0.06em",
                          boxShadow: "0 2px 6px rgba(184, 116, 0, 0.3)",
                        }}
                      >
                        {t("comingSoon")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Interactive Modal for Under-Construction Sites ────────── */}
        {selectedSite !== null && (
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
            onClick={() => setSelectedSite(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "380px",
                background: "#FFFFFF",
                borderRadius: "24px",
                padding: "1.75rem 1.5rem",
                boxShadow: "0 20px 50px rgba(53, 23, 15, 0.3)",
                border: "2px solid #E8D9C6",
                textAlign: "center",
                animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(242, 140, 0, 0.15)",
                  border: "2px dashed #F28C00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  color: "#F28C00",
                }}
              >
                <Construction size={28} />
              </div>

              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #B87400 0%, #F28C00 100%)",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontWeight: 900,
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  letterSpacing: "0.06em",
                  marginBottom: "0.4rem",
                }}
              >
                {t("comingSoon")}
              </span>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--clr-brown)", margin: "0.4rem 0 0.5rem" }}>
                Under Construction!
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--txt-muted)", fontWeight: 600, lineHeight: 1.45, margin: "0 0 1.25rem" }}>
                Our team is actively setting up this partner store on the trail with artisanal kitchen equipment and live menu integration.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {matchingStores.length > 0 && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleOpenStore(matchingStores[0].slug)}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <StoreIcon size={16} />
                    <span>{t("visitOpenStore")}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedSite(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--txt-muted)",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                >
                  {t("closeNotice")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Premium Location Bottom Sheet Modal (Portaled directly to document.body) ── */}
      {isDropdownOpen &&
        createPortal(
          <div
            id="location-bottom-sheet-backdrop"
            onClick={closeBottomSheet}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(53, 23, 15, 0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              animation: "fadeInOverlay 0.25s ease forwards",
              touchAction: isDraggingSheet ? "none" : "auto",
            }}
          >
            <div
              id="location-bottom-sheet-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "540px",
                margin: "0 auto",
                background: "#FFFFFF",
                borderTopLeftRadius: "28px",
                borderTopRightRadius: "28px",
                borderTop: "2px solid rgba(242, 140, 0, 0.35)",
                boxShadow: "0 -16px 48px rgba(53, 23, 15, 0.35)",
                padding: "0.75rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px))",
                maxHeight: "82vh",
                display: "flex",
                flexDirection: "column",
                transform: `translateY(${sheetOffsetY}px)`,
                transition: isDraggingSheet ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: isDraggingSheet ? "none" : "bottomSheetUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                boxSizing: "border-box",
                userSelect: "none",
              }}
            >
              {/* Grab Handle Touch Zone (Pull down to dismiss) */}
              <div
                onMouseDown={(e) => handleDragStart(e.clientY)}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleDragStart(e.touches[0].clientY);
                }}
                style={{
                  width: "100%",
                  padding: "0.5rem 0 0.85rem",
                  cursor: isDraggingSheet ? "grabbing" : "grab",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "none",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "5px",
                    borderRadius: "9999px",
                    background: "#D8C7B4",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                />
              </div>

              {/* Header Row (Also draggable) */}
              <div
                onMouseDown={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest("button")) handleDragStart(e.clientY);
                }}
                onTouchStart={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest("button") && e.touches[0]) handleDragStart(e.touches[0].clientY);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.85rem",
                  gap: "0.75rem",
                  width: "100%",
                  cursor: isDraggingSheet ? "grabbing" : "grab",
                  touchAction: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                  {/* Perfect Squircle Icon Container */}
                  <div
                    style={{
                      width: "40px",
                      minWidth: "40px",
                      maxWidth: "40px",
                      height: "40px",
                      minHeight: "40px",
                      maxHeight: "40px",
                      aspectRatio: "1 / 1",
                      flexShrink: 0,
                      borderRadius: "14px",
                      background: "rgba(242, 140, 0, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#D9730D",
                      boxSizing: "border-box",
                    }}
                  >
                    <MapPin size={20} strokeWidth={2.6} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16.5px",
                        fontWeight: 900,
                        color: "#35170F",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("selectLocation")}
                    </h3>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#8C6D62",
                        lineHeight: 1.25,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t("chooseLocalArea")}
                    </p>
                  </div>
                </div>

                {/* Perfect Round Close Button */}
                <button
                  type="button"
                  onClick={closeBottomSheet}
                  aria-label="Close"
                  style={{
                    width: "36px",
                    minWidth: "36px",
                    maxWidth: "36px",
                    height: "36px",
                    minHeight: "36px",
                    maxHeight: "36px",
                    aspectRatio: "1 / 1",
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "#FCECD9",
                    border: "none",
                    color: "#35170F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "transform 0.15s ease, background 0.15s ease",
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <X size={18} strokeWidth={2.6} />
                </button>
              </div>

              {/* Search Input Filter */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.85rem",
                }}
              >
                <Search
                  size={16}
                  color="#8C6D62"
                  style={{ position: "absolute", left: "14px", pointerEvents: "none" }}
                />
                <input
                  type="text"
                  placeholder={t("searchLocationPlaceholder")}
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 14px 0 38px",
                    borderRadius: "14px",
                    border: "1.5px solid #E8D9C6",
                    background: "#FAF4E8",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#35170F",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {locationSearch && (
                  <button
                    type="button"
                    onClick={() => setLocationSearch("")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      color: "#8C6D62",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* List of Locations */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  overflowY: "auto",
                  maxHeight: "340px",
                  paddingRight: "2px",
                }}
              >
                {(() => {
                  const filtered = locations
                    .filter((loc) => {
                      if (!locationSearch.trim()) return true;
                      const q = locationSearch.toLowerCase();
                      return (
                        loc.locationName.toLowerCase().includes(q) ||
                        (loc.locationCode && loc.locationCode.toLowerCase().includes(q))
                      );
                    })
                    .sort((a, b) => a.locationName.localeCompare(b.locationName, undefined, { sensitivity: "base" }));

                  if (filtered.length === 0) {
                    return (
                      <div
                        style={{
                          padding: "2rem 1rem",
                          textAlign: "center",
                          color: "#8C6D62",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        No locations found matching "{locationSearch}"
                      </div>
                    );
                  }

                  return filtered.map((loc) => {
                    const isSelected = selectedLocation?.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                          setIsDropdownOpen(false);
                          setLocationSearch("");
                        }}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "18px",
                          background: isSelected
                            ? "linear-gradient(135deg, #FFF6EC 0%, #FFE9D1 100%)"
                            : "#FAF4E8",
                          border: isSelected
                            ? "2px solid #F28C00"
                            : "1.5px solid rgba(232, 217, 198, 0.6)",
                          boxShadow: isSelected
                            ? "0 4px 14px rgba(242, 140, 0, 0.16)"
                            : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "all 0.18s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "12px",
                              background: isSelected
                                ? "linear-gradient(135deg, #FFB347 0%, #F28C00 100%)"
                                : "#FCECD9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isSelected ? "#FFFFFF" : "#35170F",
                              boxShadow: isSelected
                                ? "0 3px 8px rgba(242, 140, 0, 0.3)"
                                : "none",
                            }}
                          >
                            <MapPin size={18} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: 900,
                                color: "#35170F",
                                lineHeight: 1.2,
                              }}
                            >
                              {loc.locationName}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: isSelected ? "#B8420B" : "#8C6D62",
                                marginTop: "2px",
                              }}
                            >
                              Code: {loc.locationCode || "Standard Zone"}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <div
                            style={{
                              width: "26px",
                              height: "26px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #28A745 0%, #1A6E42 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFFFF",
                              boxShadow: "0 2px 6px rgba(40, 167, 69, 0.35)",
                            }}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        ) : (
                          <ChevronRight size={18} color="#C4A89E" />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StoresPage;
