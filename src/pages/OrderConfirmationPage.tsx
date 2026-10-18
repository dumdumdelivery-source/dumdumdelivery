import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import type { Order } from "../types";
import { getOrderById } from "../services/orderService";
import { NotFoundIllustration, OrderSuccessIllustration } from "../components/illustrations";

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((fetched) => setOrder(fetched))
        .finally(() => setLoading(false));
    }
  }, [order, orderId]);

  if (loading) {
    return (
      <div className="app-container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Loading your order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="app-container animate-fade-in" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className="empty-state-box">
          <div className="empty-illustration">
            <NotFoundIllustration />
          </div>
          <h2 className="empty-title">Order Not Found</h2>
          <p className="empty-desc">We couldn't locate this order in Firestore.</p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in" style={{ padding: "2.5rem 1rem", maxWidth: "720px" }}>
      {/* Celebration Header */}
      <div
        className="game-card"
        style={{
          textAlign: "center",
          padding: "2.5rem 1.5rem",
          marginBottom: "1.75rem",
          background: "#FFFFFF",
          borderColor: "var(--clr-primary)"
        }}
      >
        <div className="empty-illustration" style={{ margin: "0 auto 1.25rem" }}>
          <OrderSuccessIllustration width={220} height={150} />
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--clr-brown)", marginBottom: "0.4rem" }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--txt-secondary)", maxWidth: "480px", margin: "0 auto 1rem" }}>
          Thank you for ordering from <strong>{order.storeName}</strong>. Your treats will be prepared fresh and dispatched soon!
        </p>

        <div
          style={{
            display: "inline-block",
            background: "var(--clr-primary-lt)",
            border: "1.5px solid var(--clr-primary)",
            padding: "0.45rem 1.25rem",
            borderRadius: "var(--radius-pill)",
            fontWeight: 900,
            color: "var(--clr-brown)",
            fontSize: "1rem"
          }}
        >
          Order Reference: {order.orderNumber}
        </div>
      </div>

      {/* Demo notice badge */}
      <div className="notice-box">
        <ShieldAlert size={20} color="#F28C00" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Demo / Payment-Pending Order:</strong> Payment status is currently marked as <em>{order.paymentStatus}</em>. No live monetary charge occurred.
        </div>
      </div>

      {/* Order Details Card */}
      <div className="game-card" style={{ padding: "1.75rem", background: "#FFFFFF", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid var(--border-base)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--txt-muted)", fontWeight: 700 }}>Store</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--clr-brown)" }}>
              {order.storeName}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--txt-muted)", fontWeight: 700 }}>Status</div>
            <span className="badge-active" style={{ textTransform: "capitalize" }}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--clr-brown)", marginBottom: "0.75rem" }}>
            Ordered Items
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px dashed var(--border-base)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-sm)",
                      objectFit: "cover",
                      border: "1px solid var(--border-base)"
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--clr-brown)" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--txt-muted)" }}>
                      ₹{item.unitPrice} × {item.quantity}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: "0.95rem", color: "var(--clr-brown)" }}>
                  ₹{item.subtotal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ background: "var(--bg-app)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--txt-secondary)", marginBottom: "0.4rem" }}>
            <span>Items Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--txt-secondary)", marginBottom: "0.4rem" }}>
            <span>Ground Shipping:</span>
            <span>{order.shippingCharge === 0 ? "FREE (Threshold > ₹100)" : `₹${order.shippingCharge}`}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 900,
              fontSize: "1.2rem",
              color: "var(--clr-brown)",
              borderTop: "1.5px solid var(--border-base)",
              paddingTop: "0.5rem",
              marginTop: "0.5rem"
            }}
          >
            <span>Total Amount:</span>
            <span style={{ color: "var(--clr-primary-dk)" }}>₹{order.total}</span>
          </div>
        </div>

        {/* Delivery Destination */}
        <div style={{ borderTop: "1.5px solid var(--border-base)", paddingTop: "1rem" }}>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--clr-brown)", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <MapPin size={16} color="#F28C00" />
            <span>Delivering To</span>
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--txt-primary)", lineHeight: 1.4 }}>
            <strong>{order.customerDetails.name}</strong> · {order.customerDetails.phoneNumber}
            <br />
            {order.customerDetails.deliveryAddress.addressLine1}
            {order.customerDetails.deliveryAddress.addressLine2 ? `, ${order.customerDetails.deliveryAddress.addressLine2}` : ""}
            <br />
            {order.customerDetails.deliveryAddress.city}, {order.customerDetails.deliveryAddress.state} — {order.customerDetails.deliveryAddress.postalCode}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </Link>
        <Link to="/orders" className="btn-surface" style={{ flex: 1, textAlign: "center" }}>
          View My Orders
        </Link>
      </div>
    </div>
  );
};
