import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CartItem, Product, StoreCartGroup, ToastMessage } from "../types";
import { SHIPPING_FREE_THRESHOLD, calculateShippingCharge } from "../services/orderService";

interface CartContextType {
  items: CartItem[];
  storeGroups: StoreCartGroup[];
  totalItemCount: number;
  overallSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearStoreCart: (storeId: string) => void;
  clearCart: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const LOCAL_STORAGE_KEY = "dumdum_cart_items_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist items to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not write cart to localStorage", e);
    }
  }, [items]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.isActive || product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, "error");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`, "error");
          return prev;
        }
        showToast(`Updated ${product.name} quantity in cart! 🛍️`, "success");
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: nextQty } : i
        );
      } else {
        showToast(`Added ${product.name} to cart! 🍭`, "success");
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            storeId: product.storeId,
            storeName: product.storeName,
            quantity,
            stock: product.stock
          }
        ];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId) {
          if (quantity > i.stock) {
            showToast(`Cannot exceed available stock (${i.stock}).`, "error");
            return i;
          }
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.productId === productId);
      if (removed) {
        showToast(`Removed ${removed.name} from cart`, "info");
      }
      return prev.filter((i) => i.productId !== productId);
    });
  };

  const clearStoreCart = (storeId: string) => {
    setItems((prev) => prev.filter((i) => i.storeId !== storeId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Group items by storeId
  const storeGroups = useMemo<StoreCartGroup[]>(() => {
    const map = new Map<string, StoreCartGroup>();

    items.forEach((item) => {
      if (!map.has(item.storeId)) {
        map.set(item.storeId, {
          storeId: item.storeId,
          storeName: item.storeName || "Sweet Shop",
          items: [],
          subtotal: 0,
          shippingCharge: 0,
          total: 0,
          freeShippingRemaining: SHIPPING_FREE_THRESHOLD
        });
      }

      const group = map.get(item.storeId)!;
      group.items.push(item);
      group.subtotal += item.price * item.quantity;
    });

    return Array.from(map.values()).map((group) => {
      const shippingCharge = calculateShippingCharge(group.subtotal);
      const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - group.subtotal);
      return {
        ...group,
        shippingCharge,
        total: group.subtotal + shippingCharge,
        freeShippingRemaining: remaining
      };
    });
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const overallSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        storeGroups,
        totalItemCount,
        overallSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearStoreCart,
        clearCart,
        toasts,
        removeToast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
