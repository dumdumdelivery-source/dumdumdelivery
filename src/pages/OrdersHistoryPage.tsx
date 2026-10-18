import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Store, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderService";
import { EmptyOrdersIllustration } from "../components/illustrations";
import { OrdersHistorySkeleton } from "../components/Skeleton";
import type { Order } from "../types";

export const OrdersHistoryPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
      return;
    }

    if (user) {
      setLoading(true);
      getUserOrders(user.uid)
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error loading orders:", err))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="app-container" style={{ padding: "2.5rem 1rem", maxWidth: "800px" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 className="section-title">
            <Package size={26} color="#F28C00" />
            <span>My Order History</span>
          </h1>
          <p className="section-subtitle">
            Loading your orders...
          </p>
        </div>
        <OrdersHistorySkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in" style={{ padding: "2.5rem 1rem", maxWidth: "800px" }}>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 className="section-title">
          <Package size={26} color="#F28C00" />
          <span>My Order History</span>
        </h1>
        <p className="section-subtitle">
          All your previous orders saved securely in Cloud Firestore
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state-box">
          <div className="empty-illustration">
            <EmptyOrdersIllustration />
          </div>
          <h2 className="empty-title">No orders yet</h2>
          <p className="empty-desc">
            You haven't placed any orders yet. Discover our fresh bakeries and confectionery shops!
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {orders.map((order) => (
            <div key={order.id || order.orderNumber} className="game-card" style={{ padding: "1.5rem", background: "#FFFFFF" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1.5px solid var(--border-base)", paddingBottom: "0.75rem", marginBottom: "0.85rem" }}>
                <div>
                  <div style={{ fontWeight: 900, color: "var(--clr-brown)", fontSize: "1.1rem" }}>
                    {order.orderNumber}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--txt-muted)", marginTop: "2px" }}>
                    <Store size={13} color="#B8420B" />
                    <span>{order.storeName}</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span className="badge-active" style={{ textTransform: "capitalize" }}>
                    {order.orderStatus}
                  </span>
                  <div style={{ fontSize: "0.775rem", color: "var(--txt-muted)", marginTop: "3px" }}>
                    Payment: {order.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--txt-secondary)" }}>
                  {order.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border-base)", paddingTop: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--txt-muted)" }}>Total Paid (Demo): </span>
                  <strong style={{ fontSize: "1.1rem", color: "var(--clr-brown)" }}>₹{order.total}</strong>
                </div>

                <Link
                  to={`/order-confirmation/${order.id || order.orderNumber}`}
                  state={{ order }}
                  className="btn-surface"
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
                >
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
