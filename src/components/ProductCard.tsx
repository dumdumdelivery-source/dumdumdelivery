import { Plus, Check } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, items } = useCart();

  const cartItem = items.find((i) => i.productId === product.id);
  const isInCart = Boolean(cartItem);
  const isOutOfStock = !product.isActive || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="game-card product-card">
      <div className="product-img-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />

        {/* Category tag */}
        {product.category && (
          <div className="product-badge-overlay">
            <span className="badge-tag">{product.category}</span>
          </div>
        )}

        {/* Out of Stock overlay if applicable */}
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(53, 23, 15, 0.75)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3
            }}
          >
            <span className="badge-inactive" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="product-content">
        <span className="product-store-tag">{product.storeName}</span>
        <h4 className="product-name">{product.name}</h4>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">
            <span className="currency">₹</span>
            {product.price}
          </div>

          <button
            type="button"
            className={isInCart ? "btn-accent" : "btn-primary"}
            style={{
              padding: "0.45rem 0.95rem",
              fontSize: "0.825rem",
              borderRadius: "var(--radius-pill)"
            }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {isInCart ? (
              <>
                <Check size={14} />
                <span>Added ({cartItem?.quantity})</span>
              </>
            ) : isOutOfStock ? (
              <span>Unavailable</span>
            ) : (
              <>
                <Plus size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
