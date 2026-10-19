import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  Store,
  ArrowLeft,
  Save,
  AlertCircle,
  MapPin,
  Phone,
  Smartphone,
  CreditCard,
  User,
  Percent,
  Coins,
  Hash,
  AlignLeft,
  IndianRupee,
  Star,
  Upload,
  ImageIcon,
  X,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { createShop, getShopById, getLocations, updateShop } from "../../services/adminService";
import { uploadImageToCloudinary } from "../../services/cloudinaryService";
import type { LocationItem } from "../../types/admin";
import { getFriendlyErrorMessage } from "../../utils/errorUtils";
import { CustomSelect } from "../../components/CustomSelect";
import { FormSkeleton } from "../../components/Skeleton";

export const ShopFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Form State for all 10 requested fields
  const [shopLegalName, setShopLegalName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopTelNumber, setShopTelNumber] = useState("");
  const [ownerMobileNumber, setOwnerMobileNumber] = useState("");
  const [paymentMobileNumber, setPaymentMobileNumber] = useState("");
  const [locationId, setLocationId] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [paymentPercentage, setPaymentPercentage] = useState<number | string>(5.0);
  const [minimumOrderAmount, setMinimumOrderAmount] = useState<number | string>(100);
  const [rating, setRating] = useState<number | string>(4.8);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lookups and Status
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB. Please choose a smaller image.");
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setImageUrl(uploadedUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to upload store image to Cloudinary.");
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setFetching(true);
        const locList = await getLocations();
        setLocations(locList);

        if (id) {
          const shop = await getShopById(id);
          if (shop) {
            setShopLegalName(shop.shopLegalName);
            setReqNo(shop.reqNo);
            setOwnerName(shop.ownerName);
            setShopTelNumber(shop.shopTelNumber || "");
            setOwnerMobileNumber(shop.ownerMobileNumber);
            setPaymentMobileNumber(shop.paymentMobileNumber);
            setLocationId(shop.locationId);
            setDetailedAddress(shop.detailedAddress);
            setPaymentPercentage(shop.paymentPercentage);
            setMinimumOrderAmount(shop.minimumOrderAmount);
            setRating(shop.rating !== undefined ? shop.rating : 4.8);
            setImageUrl(shop.imageUrl || "");
          } else {
            setError("Shop partner record not found.");
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

    // Validation
    if (!shopLegalName.trim()) {
      setError("Please enter the Shop Legal Name.");
      return;
    }
    if (!reqNo.trim()) {
      setError("Please provide a Req No (Registration / Request number).");
      return;
    }
    if (!ownerName.trim()) {
      setError("Please enter the Owner Name.");
      return;
    }
    if (!ownerMobileNumber.trim()) {
      setError("Please enter the Owner Mobile Number.");
      return;
    }
    if (!paymentMobileNumber.trim()) {
      setError("Please enter the Payment Mobile Number.");
      return;
    }
    if (!locationId) {
      setError("Please select an operating Location (Lookup).");
      return;
    }
    if (!detailedAddress.trim()) {
      setError("Please provide the Detailed Address.");
      return;
    }
    if (paymentPercentage === "" || Number(paymentPercentage) < 0) {
      setError("Please enter a valid Payment Percentage (e.g. 5.5).");
      return;
    }
    if (minimumOrderAmount === "" || Number(minimumOrderAmount) < 0) {
      setError("Please enter a valid Minimum Order Amount (e.g. 100).");
      return;
    }
    const numRating = Number(rating);
    if (rating === "" || isNaN(numRating) || numRating < 1.0 || numRating > 5.0) {
      setError("Please enter a valid Rating between 1.0 and 5.0 (e.g. 4.8).");
      return;
    }

    const selectedLoc = locations.find((l) => l.id === locationId);

    try {
      setLoading(true);
      const payload = {
        shopLegalName: shopLegalName.trim(),
        reqNo: reqNo.trim().toUpperCase(),
        ownerName: ownerName.trim(),
        shopTelNumber: shopTelNumber.trim(),
        ownerMobileNumber: ownerMobileNumber.trim(),
        paymentMobileNumber: paymentMobileNumber.trim(),
        locationId,
        locationName: selectedLoc?.locationName || "",
        detailedAddress: detailedAddress.trim(),
        paymentPercentage: Number(paymentPercentage),
        minimumOrderAmount: Number(minimumOrderAmount),
        rating: numRating,
        imageUrl: imageUrl.trim(),
        status: "active" as const,
      };

      if (isEdit && id) {
        await updateShop(id, payload);
      } else {
        await createShop(payload);
      }
      navigate("/admin/shops");
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: "1.25rem 0.85rem 7.5rem", maxWidth: "780px", margin: "0 auto", boxSizing: "border-box" }}>
      {/* Back button */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          to="/admin/shops"
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
          <span>Back to Shops</span>
        </Link>
      </div>

      <div className="game-card" style={{ padding: "1.75rem", background: "#FFFFFF", borderRadius: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(242, 140, 0, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F28C00",
              flexShrink: 0,
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--clr-brown)", margin: 0 }}>
              {isEdit ? "Edit Shop Partner" : "Register New Shop Partner"}
            </h1>
            <p style={{ fontSize: "0.825rem", color: "var(--txt-muted)", margin: 0, fontWeight: 700 }}>
              Official legal credentials, merchant contacts, location, and commercial terms
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
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
            {/* ── Section 1: Shop Identity ── */}
            <div className="form-section-card">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <Store size={18} />
                </div>
                <div>
                  <h2 className="form-section-title">Shop Legal Identity</h2>
                  <p className="form-section-desc">Registered merchant identity and registration reference</p>
                </div>
              </div>

              <div className="form-grid-2">
                {/* Shop Legal Name */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-legal-name">
                      <Store size={15} color="#F28C00" />
                      <span>Shop Legal Name</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Store size={17} />
                    </span>
                    <input
                      id="shop-legal-name"
                      type="text"
                      className="form-input has-icon"
                      placeholder="e.g. DumDum Sweet Factory Pvt Ltd"
                      value={shopLegalName}
                      onChange={(e) => setShopLegalName(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">Official registered name of the store or merchant entity.</span>
                </div>

                {/* Req No */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-req-no">
                      <Hash size={15} color="#F28C00" />
                      <span>Req No</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Hash size={17} />
                    </span>
                    <input
                      id="shop-req-no"
                      type="text"
                      className="form-input has-icon"
                      placeholder="e.g. REQ-2026-001"
                      value={reqNo}
                      onChange={(e) => setReqNo(e.target.value.toUpperCase())}
                      required
                      style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 800 }}
                    />
                  </div>
                  <span className="form-hint">Merchant intake or partner registration file number.</span>
                </div>
              </div>
            </div>

            {/* ── Section 2: Store Image & Branding (Cloudinary) ── */}
            <div className="form-section-card" id="store-image-section">
              <div className="form-section-header">
                <div className="form-section-icon" style={{ background: "rgba(242, 140, 0, 0.14)", color: "#F28C00" }}>
                  <ImageIcon size={18} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h2 className="form-section-title">Store Image & Branding</h2>
                    <span className="form-badge-opt">Optional</span>
                  </div>
                  <p className="form-section-desc">Storefront photo, banner, or logo displayed to customers</p>
                </div>
              </div>

              {/* Store Image Upload Zone */}
              <div
                style={{
                  border: imageUrl ? "2px solid #1A6E42" : "2px dashed var(--border-base)",
                  background: imageUrl ? "rgba(26, 110, 66, 0.04)" : "rgba(255, 247, 232, 0.4)",
                  borderRadius: "18px",
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Image Preview Box */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "16px",
                    background: "#FFFFFF",
                    border: "2px solid #E8D9C6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    boxShadow: "0 3px 10px rgba(53, 23, 15, 0.08)",
                  }}
                >
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Store Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        aria-label="Remove store image"
                        title="Remove Store Image"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "rgba(53, 23, 15, 0.85)",
                          color: "#FFFFFF",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "0.25rem" }}>
                      <Camera size={34} color="#D97B00" style={{ opacity: 0.5, margin: "0 auto 4px" }} />
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "var(--txt-muted)", display: "block" }}>
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* File picker & actions */}
                <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                    {/* Native file input with ref */}
                    <input
                      ref={fileInputRef}
                      id="shop-image-file"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploadingImage}
                      onChange={handleImageFileChange}
                    />

                    {/* Prominent Browse / Upload Button */}
                    <button
                      type="button"
                      id="btn-choose-store-image"
                      className="btn-primary"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "0.65rem 1.25rem",
                        fontSize: "0.875rem",
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: uploadingImage ? "not-allowed" : "pointer",
                      }}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="loading-spinner" style={{ width: "15px", height: "15px" }} />
                          <span>Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>{imageUrl ? "Change Store Image" : "Upload Store Image"}</span>
                        </>
                      )}
                    </button>

                    {imageUrl && (
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#1A6E42", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <CheckCircle2 size={16} />
                        <span>Saved in Cloudinary</span>
                      </span>
                    )}
                  </div>

                  <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.775rem", color: "var(--txt-muted)", fontWeight: 600 }}>
                    Select an image from device gallery, file system, or camera. JPG, PNG, WebP up to 10MB.
                  </p>

                  {/* Direct URL input */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <div className="form-label-row">
                      <label className="form-label" htmlFor="shop-image-url" style={{ fontSize: "0.775rem" }}>
                        <ImageIcon size={13} color="#F28C00" />
                        <span>Store Image URL</span>
                      </label>
                      <span className="form-badge-opt">Auto-filled</span>
                    </div>
                    <div className="form-input-wrapper">
                      <span className="form-input-icon">
                        <ImageIcon size={16} />
                      </span>
                      <input
                        id="shop-image-url"
                        type="url"
                        className="form-input has-icon"
                        style={{ fontSize: "0.825rem", padding: "0.55rem 0.75rem 0.55rem 2.5rem" }}
                        placeholder="https://res.cloudinary.com/mtyahieb/... or paste web image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Owner & Contact Numbers ── */}
            <div className="form-section-card">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="form-section-title">Owner & Contact Numbers</h2>
                  <p className="form-section-desc">Direct contact personnel and settlement mobile numbers</p>
                </div>
              </div>

              <div className="form-grid-2">
                {/* Owner Name */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-owner-name">
                      <User size={15} color="#F28C00" />
                      <span>Owner Name</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <User size={17} />
                    </span>
                    <input
                      id="shop-owner-name"
                      type="text"
                      className="form-input has-icon"
                      placeholder="e.g. Varatharaj"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">Full name of the principal merchant or business manager.</span>
                </div>

                {/* Shop tel Number */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-tel-number">
                      <Phone size={15} color="#8C7565" />
                      <span>Shop tel Number</span>
                    </label>
                    <span className="form-badge-opt">Optional</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Phone size={17} />
                    </span>
                    <input
                      id="shop-tel-number"
                      type="tel"
                      className="form-input has-icon"
                      placeholder="e.g. 044-26194455"
                      value={shopTelNumber}
                      onChange={(e) => setShopTelNumber(e.target.value)}
                    />
                  </div>
                  <span className="form-hint">Store landline or counter direct telephone number.</span>
                </div>

                {/* Owner Mobile Number */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-owner-mobile">
                      <Smartphone size={15} color="#F28C00" />
                      <span>Owner Mobile Number</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Smartphone size={17} />
                    </span>
                    <input
                      id="shop-owner-mobile"
                      type="tel"
                      className="form-input has-icon"
                      placeholder="e.g. +91 98401 23456"
                      value={ownerMobileNumber}
                      onChange={(e) => setOwnerMobileNumber(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">Used for urgent dispatch coordination & critical merchant alerts.</span>
                </div>

                {/* Payment Mobile Number */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-payment-mobile">
                      <CreditCard size={15} color="#F28C00" />
                      <span>Payment Mobile Number</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <CreditCard size={17} />
                    </span>
                    <input
                      id="shop-payment-mobile"
                      type="tel"
                      className="form-input has-icon"
                      placeholder="e.g. +91 98401 23456 (UPI / Settlement)"
                      value={paymentMobileNumber}
                      onChange={(e) => setPaymentMobileNumber(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">UPI / IMPS mobile number for daily payout disbursements.</span>
                </div>
              </div>
            </div>

            {/* ── Section 4: Operating Location & Detailed Address ── */}
            <div className="form-section-card">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="form-section-title">Location & Physical Store Address</h2>
                  <p className="form-section-desc">Parent hub lookup and exact street address for order pickups</p>
                </div>
              </div>

              {/* Location ( Lookup ) */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="shop-location-lookup">
                    <MapPin size={15} color="#F28C00" />
                    <span>Location ( Lookup )</span>
                  </label>
                  <span className="form-badge-req">Required</span>
                </div>
                {locations.length === 0 ? (
                  <div style={{ padding: "0.85rem 1rem", background: "rgba(184, 66, 11, 0.08)", borderRadius: "12px", fontSize: "0.85rem", color: "var(--clr-accent)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertCircle size={18} />
                    <span>
                      No locations found. Please{" "}
                      <Link to="/admin/locations/new" style={{ color: "var(--clr-brown)", fontWeight: 800 }}>
                        create a Location first
                      </Link>
                      .
                    </span>
                  </div>
                ) : (
                  <CustomSelect
                    id="shop-location-lookup"
                    value={locationId}
                    onChange={(val) => setLocationId(val)}
                    placeholder="-- Select Hub Location --"
                    required
                    icon={<MapPin size={17} />}
                    options={locations.map((loc) => ({
                      value: loc.id,
                      label: `${loc.locationCode} • ${loc.locationName}`,
                      icon: <MapPin size={14} color="#F28C00" />
                    }))}
                  />
                )}
                <span className="form-hint">Select the territory hub responsible for this partner store.</span>
              </div>

              {/* Detailed Address ( Text area ) */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label" htmlFor="shop-detailed-address">
                    <AlignLeft size={15} color="#F28C00" />
                    <span>Detailed Address ( Text area )</span>
                  </label>
                  <span className="form-badge-req">Required</span>
                </div>
                <textarea
                  id="shop-detailed-address"
                  className="form-input"
                  rows={3}
                  placeholder="Door No, Building Name, Street / Cross Road, Landmark, City, Pincode..."
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  required
                />
                <span className="form-hint">Physical dispatch address printed on delivery bags & rider waybills.</span>
              </div>
            </div>

            {/* ── Section 5: Commercial & Order Terms ── */}
            <div className="form-section-card">
              <div className="form-section-header">
                <div className="form-section-icon">
                  <Coins size={18} />
                </div>
                <div>
                  <h2 className="form-section-title">Commercial Terms & Order Rules</h2>
                  <p className="form-section-desc">Commission fee percentage and minimum basket value rules</p>
                </div>
              </div>

              <div className="form-grid-2">
                {/* Payment Percentage */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-payment-percentage">
                      <Percent size={15} color="#F28C00" />
                      <span>Payment Percentage</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Percent size={17} />
                    </span>
                    <input
                      id="shop-payment-percentage"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="form-input has-icon has-affix"
                      placeholder="e.g. 5.5"
                      value={paymentPercentage}
                      onChange={(e) => setPaymentPercentage(e.target.value)}
                      required
                      style={{ fontWeight: 800 }}
                    />
                    <span className="form-input-affix">%</span>
                  </div>
                  <span className="form-hint">Platform commission deducted per completed order transaction.</span>
                </div>

                {/* Minimim Order Amount */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-min-order">
                      <IndianRupee size={15} color="#F28C00" />
                      <span>Minimim Order Amount</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <IndianRupee size={17} />
                    </span>
                    <input
                      id="shop-min-order"
                      type="number"
                      step="1"
                      min="0"
                      className="form-input has-icon has-affix"
                      placeholder="e.g. 100 or 150"
                      value={minimumOrderAmount}
                      onChange={(e) => setMinimumOrderAmount(e.target.value)}
                      required
                      style={{ fontWeight: 800 }}
                    />
                    <span className="form-input-affix">INR</span>
                  </div>
                  <span className="form-hint">Minimum checkout basket threshold required for customer orders.</span>
                </div>

                {/* Rating (★ 1.0 - 5.0) */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label" htmlFor="shop-rating">
                      <Star size={15} color="#F28C00" fill="#F28C00" />
                      <span>Rating (★ 1.0 - 5.0)</span>
                    </label>
                    <span className="form-badge-req">Required</span>
                  </div>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <Star size={17} color="#F28C00" />
                    </span>
                    <input
                      id="shop-rating"
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="form-input has-icon has-affix"
                      placeholder="e.g. 4.8"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                      style={{ fontWeight: 800 }}
                    />
                    <span className="form-input-affix">★</span>
                  </div>
                  <span className="form-hint">Display rating shown to customers on store cards and storefront (e.g. 4.8).</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions-row">
              <button
                type="button"
                className="btn-surface"
                onClick={() => navigate("/admin/shops")}
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
                    <span>{isEdit ? "Update Shop Partner" : "Save Shop Partner"}</span>
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
