import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../types";
import { INITIAL_PRODUCTS, INITIAL_STORES } from "./seedService";

// Fallback products mapped to fallback stores
export const FALLBACK_PRODUCTS: Product[] = INITIAL_PRODUCTS.map((p, idx) => {
  const storeIndex = INITIAL_STORES.findIndex((s) => s.slug === p.storeSlug);
  const storeId = `fallback-store-${storeIndex + 1}`;
  const { storeSlug, ...rest } = p;
  return {
    id: `fallback-product-${idx + 1}`,
    storeId,
    ...rest
  };
});

export async function fetchProducts(storeId?: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    let q = query(productsRef, where("isActive", "==", true));

    if (storeId && !storeId.startsWith("fallback-store-")) {
      q = query(productsRef, where("isActive", "==", true), where("storeId", "==", storeId));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      if (storeId) {
        return FALLBACK_PRODUCTS.filter((p) => p.storeId === storeId);
      }
      return FALLBACK_PRODUCTS;
    }

    const products = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Product, "id">)
    }));

    if (storeId) {
      return products.filter((p) => p.storeId === storeId);
    }

    return products;
  } catch (error) {
    console.warn("Unable to fetch products from Firestore, using local catalog:", error);
    if (storeId) {
      return FALLBACK_PRODUCTS.filter((p) => p.storeId === storeId);
    }
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    if (productId.startsWith("fallback-product-")) {
      return FALLBACK_PRODUCTS.find((p) => p.id === productId) || null;
    }

    const docRef = doc(db, "products", productId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
    }
    return null;
  } catch (error) {
    console.warn("Error fetching product by ID:", error);
    return FALLBACK_PRODUCTS.find((p) => p.id === productId) || null;
  }
}
