import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { LocationItem, AreaItem, ShopItem } from "../types/admin";
import { getFriendlyErrorMessage } from "../utils/errorUtils";

const LOCATIONS_COLL = "locations";
const AREAS_COLL = "areas";
const SHOPS_COLL = "shops";

const LOCAL_KEY_LOCATIONS = "dumdum_admin_locations_cache";
const LOCAL_KEY_AREAS = "dumdum_admin_areas_cache";
const LOCAL_KEY_SHOPS = "dumdum_admin_shops_cache";

function withTimeout<T>(promise: Promise<T>, ms = 1200): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Network fetch timeout - using local cache")), ms)
    )
  ]);
}

function getLocalList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignore quota issues
  }
}
// One-time cleanup of legacy mock default items from browser cache
try {
  const legacyLocs = getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  if (legacyLocs.some((l) => l.id.startsWith("loc_maa_") || l.id.startsWith("loc_blr_") || l.id.startsWith("loc_cbe_"))) {
    localStorage.removeItem(LOCAL_KEY_LOCATIONS);
  }
  const legacyAreas = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
  if (legacyAreas.some((a) => a.id.startsWith("area_maa_") || a.id.startsWith("area_blr_"))) {
    localStorage.removeItem(LOCAL_KEY_AREAS);
  }
  const legacyShops = getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  if (legacyShops.some((s) => s.id === "shop_001")) {
    localStorage.removeItem(LOCAL_KEY_SHOPS);
  }
} catch {
  // Ignore in non-browser env
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOCATIONS CRUD
   ───────────────────────────────────────────────────────────────────────────── */
export async function getLocations(): Promise<LocationItem[]> {
  try {
    const q = query(collection(db, LOCATIONS_COLL), orderBy("locationCode", "asc"));
    const snap = await withTimeout(getDocs(q), 4000);
    const list: LocationItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        locationCode: data.locationCode || "",
        locationName: data.locationName || "",
        isActive: data.isActive !== false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });

    saveLocalList(LOCAL_KEY_LOCATIONS, list);
    return list;
  } catch (err: any) {
    console.warn("Firestore locations fetch note:", getFriendlyErrorMessage(err));
    return getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  }
}

export async function getLocationById(id: string): Promise<LocationItem | null> {
  try {
    const d = await withTimeout(getDoc(doc(db, LOCATIONS_COLL, id)), 1000);
    if (d.exists()) {
      const data = d.data();
      return {
        id: d.id,
        locationCode: data.locationCode || "",
        locationName: data.locationName || "",
        isActive: data.isActive !== false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
  } catch (err: any) {
    console.warn("Firestore getLocationById fallback:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  return cached.find((item) => item.id === id) || null;
}

export async function createLocation(data: Omit<LocationItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const cleanData = {
    locationCode: data.locationCode.trim().toUpperCase(),
    locationName: data.locationName.trim(),
    isActive: data.isActive !== false
  };

  let newId = `loc_${Date.now()}`;

  // Try Firestore
  try {
    const ref = await addDoc(collection(db, LOCATIONS_COLL), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    newId = ref.id;
  } catch (err: any) {
    console.warn("Firestore createLocation saved to local storage:", getFriendlyErrorMessage(err));
  }

  // Update local cache
  const cached = getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  const newItem: LocationItem = {
    id: newId,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  saveLocalList(LOCAL_KEY_LOCATIONS, [...cached, newItem]);
  return newId;
}

export async function updateLocation(id: string, data: Partial<LocationItem>): Promise<void> {
  const payload: any = { ...data };
  if (payload.locationCode) payload.locationCode = payload.locationCode.trim().toUpperCase();
  if (payload.locationName) payload.locationName = payload.locationName.trim();
  delete payload.id;

  try {
    const ref = doc(db, LOCATIONS_COLL, id);
    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp()
    });
  } catch (err: any) {
    console.warn("Firestore updateLocation updated local cache:", getFriendlyErrorMessage(err));
  }

  // Update local cache
  const cached = getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  const updated = cached.map((item) =>
    item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item
  );
  saveLocalList(LOCAL_KEY_LOCATIONS, updated);
}

export async function deleteLocation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, LOCATIONS_COLL, id));
  } catch (err: any) {
    console.warn("Firestore deleteLocation removed from local cache:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<LocationItem>(LOCAL_KEY_LOCATIONS);
  saveLocalList(LOCAL_KEY_LOCATIONS, cached.filter((item) => item.id !== id));
}

/* ─────────────────────────────────────────────────────────────────────────────
   AREAS CRUD
   ───────────────────────────────────────────────────────────────────────────── */
export async function getAreas(locationIdFilter?: string): Promise<AreaItem[]> {
  try {
    const q = query(collection(db, AREAS_COLL), orderBy("areaName", "asc"));
    const snap = await withTimeout(getDocs(q), 4000);
    const list: AreaItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        locationId: data.locationId || "",
        locationCode: data.locationCode || "",
        locationName: data.locationName || "",
        areaName: data.areaName || "",
        isActive: data.isActive !== false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });

    saveLocalList(LOCAL_KEY_AREAS, list);
    return locationIdFilter ? list.filter((a) => a.locationId === locationIdFilter) : list;
  } catch (err: any) {
    console.warn("Firestore getAreas fallback:", getFriendlyErrorMessage(err));
    const cached = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
    return locationIdFilter ? cached.filter((a) => a.locationId === locationIdFilter) : cached;
  }
}

export async function getAreaById(id: string): Promise<AreaItem | null> {
  try {
    const d = await withTimeout(getDoc(doc(db, AREAS_COLL, id)), 1000);
    if (d.exists()) {
      const data = d.data();
      return {
        id: d.id,
        locationId: data.locationId || "",
        locationCode: data.locationCode || "",
        locationName: data.locationName || "",
        areaName: data.areaName || "",
        isActive: data.isActive !== false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
  } catch (err: any) {
    console.warn("Firestore getAreaById fallback:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
  return cached.find((item) => item.id === id) || null;
}

export async function createArea(data: Omit<AreaItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const cleanData = {
    locationId: data.locationId,
    locationCode: data.locationCode || "",
    locationName: data.locationName || "",
    areaName: data.areaName.trim(),
    isActive: data.isActive !== false
  };

  let newId = `area_${Date.now()}`;

  try {
    const ref = await addDoc(collection(db, AREAS_COLL), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    newId = ref.id;
  } catch (err: any) {
    console.warn("Firestore createArea saved to local storage:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
  const newItem: AreaItem = {
    id: newId,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  saveLocalList(LOCAL_KEY_AREAS, [...cached, newItem]);
  return newId;
}

export async function updateArea(id: string, data: Partial<AreaItem>): Promise<void> {
  const payload: any = { ...data };
  if (payload.areaName) payload.areaName = payload.areaName.trim();
  delete payload.id;

  try {
    const ref = doc(db, AREAS_COLL, id);
    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp()
    });
  } catch (err: any) {
    console.warn("Firestore updateArea updated local cache:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
  const updated = cached.map((item) =>
    item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item
  );
  saveLocalList(LOCAL_KEY_AREAS, updated);
}

export async function deleteArea(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, AREAS_COLL, id));
  } catch (err: any) {
    console.warn("Firestore deleteArea removed from local cache:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<AreaItem>(LOCAL_KEY_AREAS);
  saveLocalList(LOCAL_KEY_AREAS, cached.filter((item) => item.id !== id));
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHOPS CRUD
   ───────────────────────────────────────────────────────────────────────────── */
export async function getShops(): Promise<ShopItem[]> {
  try {
    const q = query(collection(db, SHOPS_COLL), orderBy("shopLegalName", "asc"));
    const snap = await withTimeout(getDocs(q), 1000);
    const list: ShopItem[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        shopLegalName: data.shopLegalName || "",
        reqNo: data.reqNo || "",
        ownerName: data.ownerName || "",
        shopTelNumber: data.shopTelNumber || "",
        ownerMobileNumber: data.ownerMobileNumber || "",
        paymentMobileNumber: data.paymentMobileNumber || "",
        locationId: data.locationId || "",
        locationName: data.locationName || "",
        areaId: data.areaId || "",
        areaName: data.areaName || "",
        detailedAddress: data.detailedAddress || "",
        paymentPercentage: typeof data.paymentPercentage === "number" ? data.paymentPercentage : 5.0,
        minimumOrderAmount: typeof data.minimumOrderAmount === "number" ? data.minimumOrderAmount : 100,
        rating: typeof data.rating === "number" ? data.rating : 4.8,
        imageUrl: data.imageUrl || "",
        status: data.status || "active",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    });
    saveLocalList(LOCAL_KEY_SHOPS, list);
    return list;
  } catch (err: any) {
    console.warn("Firestore getShops fallback:", getFriendlyErrorMessage(err));
    return getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  }
}

export async function getShopById(id: string): Promise<ShopItem | null> {
  try {
    const d = await withTimeout(getDoc(doc(db, SHOPS_COLL, id)), 1000);
    if (d.exists()) {
      const data = d.data();
      return {
        id: d.id,
        shopLegalName: data.shopLegalName || "",
        reqNo: data.reqNo || "",
        ownerName: data.ownerName || "",
        shopTelNumber: data.shopTelNumber || "",
        ownerMobileNumber: data.ownerMobileNumber || "",
        paymentMobileNumber: data.paymentMobileNumber || "",
        locationId: data.locationId || "",
        locationName: data.locationName || "",
        areaId: data.areaId || "",
        areaName: data.areaName || "",
        detailedAddress: data.detailedAddress || "",
        paymentPercentage: typeof data.paymentPercentage === "number" ? data.paymentPercentage : 5.0,
        minimumOrderAmount: typeof data.minimumOrderAmount === "number" ? data.minimumOrderAmount : 100,
        rating: typeof data.rating === "number" ? data.rating : 4.8,
        imageUrl: data.imageUrl || "",
        status: data.status || "active",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    }
  } catch (err: any) {
    console.warn("Firestore getShopById fallback:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  return cached.find((item) => item.id === id) || null;
}

export async function createShop(data: Omit<ShopItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const cleanData = {
    shopLegalName: data.shopLegalName.trim(),
    reqNo: data.reqNo.trim().toUpperCase(),
    ownerName: data.ownerName.trim(),
    shopTelNumber: (data.shopTelNumber || "").trim(),
    ownerMobileNumber: data.ownerMobileNumber.trim(),
    paymentMobileNumber: data.paymentMobileNumber.trim(),
    locationId: data.locationId,
    locationName: data.locationName || "",
    areaId: data.areaId || "",
    areaName: data.areaName || "",
    detailedAddress: data.detailedAddress.trim(),
    paymentPercentage: Number(data.paymentPercentage) || 0,
    minimumOrderAmount: Number(data.minimumOrderAmount) || 0,
    rating: typeof data.rating === "number" ? data.rating : (Number(data.rating) || 4.8),
    imageUrl: (data.imageUrl || "").trim(),
    status: data.status || "active"
  };

  let newId = `shop_${Date.now()}`;

  try {
    const ref = await addDoc(collection(db, SHOPS_COLL), {
      ...cleanData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    newId = ref.id;
  } catch (err: any) {
    console.warn("Firestore createShop saved to local storage:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  const newItem: ShopItem = {
    id: newId,
    ...cleanData,
    createdAt: new Date().toISOString()
  };
  saveLocalList(LOCAL_KEY_SHOPS, [...cached, newItem]);
  return newId;
}

export async function updateShop(id: string, data: Partial<ShopItem>): Promise<void> {
  const payload: any = { ...data };
  if (payload.shopLegalName) payload.shopLegalName = payload.shopLegalName.trim();
  if (payload.reqNo) payload.reqNo = payload.reqNo.trim().toUpperCase();
  if (payload.ownerName) payload.ownerName = payload.ownerName.trim();
  if (payload.detailedAddress) payload.detailedAddress = payload.detailedAddress.trim();
  if (payload.imageUrl !== undefined) payload.imageUrl = payload.imageUrl.trim();
  if (payload.paymentPercentage !== undefined) payload.paymentPercentage = Number(payload.paymentPercentage);
  if (payload.minimumOrderAmount !== undefined) payload.minimumOrderAmount = Number(payload.minimumOrderAmount);
  if (payload.rating !== undefined) payload.rating = Number(payload.rating);
  delete payload.id;

  try {
    const ref = doc(db, SHOPS_COLL, id);
    await updateDoc(ref, {
      ...payload,
      updatedAt: serverTimestamp()
    });
  } catch (err: any) {
    console.warn("Firestore updateShop updated local cache:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  const updated = cached.map((item) =>
    item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item
  );
  saveLocalList(LOCAL_KEY_SHOPS, updated);
}

export async function deleteShop(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SHOPS_COLL, id));
  } catch (err: any) {
    console.warn("Firestore deleteShop removed from local cache:", getFriendlyErrorMessage(err));
  }

  const cached = getLocalList<ShopItem>(LOCAL_KEY_SHOPS);
  saveLocalList(LOCAL_KEY_SHOPS, cached.filter((item) => item.id !== id));
}

/* ─────────────────────────────────────────────────────────────────────────────
   INITIAL SEED DATA (If collections are empty)
   ───────────────────────────────────────────────────────────────────────────── */
export async function seedInitialAdminDataIfEmpty(): Promise<void> {
  // Disabled: Auto-seeding of mock records is removed.
  // When Firestore database has no records, empty "No records found" state will be displayed.
}

