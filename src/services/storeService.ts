import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Store } from "../types";
import { INITIAL_STORES } from "./seedService";

// Fallback stores if Firestore is not yet initialized or network offline
export const FALLBACK_STORES: Store[] = INITIAL_STORES.map((s, index) => ({
  id: `fallback-store-${index + 1}`,
  ...s
}));

export function extractLocationsFromStores(stores: Store[]) {
  const map = new Map<string, { id: string; locationCode: string; locationName: string; isActive: boolean }>();
  for (const s of stores) {
    const loc = s.location || (s.locationCode && s.locationName ? {
      id: s.locationId || `loc_${s.locationCode.toLowerCase()}`,
      locationId: s.locationId || `loc_${s.locationCode.toLowerCase()}`,
      locationCode: s.locationCode,
      locationName: s.locationName
    } : null);

    if (loc && loc.locationCode) {
      const code = loc.locationCode.trim().toUpperCase();
      if (!map.has(code)) {
        map.set(code, {
          id: loc.id || loc.locationId || `loc_${code.toLowerCase()}`,
          locationCode: code,
          locationName: loc.locationName || code,
          isActive: true
        });
      }
    }
  }
  return Array.from(map.values());
}

export async function fetchStores(): Promise<Store[]> {
  try {
    const storesRef = collection(db, "stores");
    const q = query(storesRef, where("isActive", "==", true));
    const snapshot = await getDocs(q);

    const mapDocToStore = (d: any): Store => {
      const data = d.data();
      const location = data.location || (data.locationCode && data.locationName ? {
        id: data.locationId || `loc_${data.locationCode.toLowerCase()}`,
        locationId: data.locationId,
        locationCode: data.locationCode,
        locationName: data.locationName
      } : undefined);

      return {
        id: d.id,
        ...data,
        locationId: data.locationId || location?.locationId,
        locationName: data.locationName || location?.locationName,
        locationCode: data.locationCode || location?.locationCode,
        location
      };
    };

    if (snapshot.empty) {
      // Also check if any stores exist without filter
      const allSnapshot = await getDocs(storesRef);
      if (!allSnapshot.empty) {
        return allSnapshot.docs.map(mapDocToStore);
      }
      return FALLBACK_STORES;
    }

    return snapshot.docs.map(mapDocToStore);
  } catch (error) {
    console.warn("Unable to fetch stores from Firestore, using local catalog:", error);
    return FALLBACK_STORES;
  }
}

export async function fetchStoreById(storeId: string): Promise<Store | null> {
  try {
    if (storeId.startsWith("fallback-store-")) {
      return FALLBACK_STORES.find((s) => s.id === storeId) || null;
    }

    const docRef = doc(db, "stores", storeId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Store, "id">) };
    }
    return null;
  } catch (error) {
    console.warn("Error fetching store by ID:", error);
    return FALLBACK_STORES.find((s) => s.id === storeId) || null;
  }
}
