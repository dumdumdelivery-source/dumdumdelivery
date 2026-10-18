import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Truck, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const location = useLocation();

  if (
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname === "/stores" ||
    location.pathname === "/cart" ||
    location.pathname === "/signin"
  ) {
    return null;
  }

  return (
    <footer className="app-footer">
      <div className="app-container">
        <div className="footer-inner">
          <div>
            <Link to="/" style={{ display: "inline-block", background: "#FFFCF5", padding: "0.45rem 0.85rem", borderRadius: "var(--radius-md)", marginBottom: "0.85rem", border: "1.5px solid var(--border-base)" }}>
              <img
                src="/logo.png"
                alt="DumDum Delivery"
                style={{ height: "44px", width: "auto", display: "block" }}
              />
            </Link>
            <p className="footer-desc">
              Your favorite local confectionery, dim sum, donuts, and sweet snacks delivered quickly and fresh to your door.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", color: "#E8D9C6", fontSize: "0.85rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Truck size={15} color="#F28C00" /> Ground Shipping
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <ShieldCheck size={15} color="#F28C00" /> Secure Firestore
              </span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home & Store Catalog</Link>
              </li>
              <li>
                <Link to="/cart">My Cart & Checkouts</Link>
              </li>
              <li>
                <Link to="/profile">Profile & Delivery Address</Link>
              </li>
              <li>
                <Link to="/orders">Order History</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Customer Policies</h4>
            <ul className="footer-links">
              <li>Free ground shipping on orders &gt; ₹100</li>
              <li>Standard delivery: ₹25 for smaller orders</li>
              <li>Shop-wise independent dispatch</li>
              <li>Demo / payment-pending checkout flow</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DumDum Delivery. Built with React, TypeScript & Cloud Firestore.</p>
        </div>
      </div>
    </footer>
  );
};
