import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Order, CartItem, DeliveryAddress } from "../types";
import { fetchProductById } from "./productService";

export const SHIPPING_FREE_THRESHOLD = 100;
export const STANDARD_SHIPPING_FEE = 25;

export function calculateShippingCharge(subtotal: number): number {
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export interface CreateOrderParams {
  userId: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  customerDetails: {
    name: string;
    phoneNumber: string;
    deliveryAddress: DeliveryAddress;
  };
}

export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const { userId, storeId, storeName, items, customerDetails } = params;

  if (!items || items.length === 0) {
    throw new Error("Cannot place an order with an empty item list.");
  }

  // Validate and recalculate unit prices against actual product records
  let verifiedSubtotal = 0;
  const verifiedItems = await Promise.all(
    items.map(async (item) => {
      let unitPrice = item.price;
      // Fetch latest product record to guarantee trusted price
      const latestProduct = await fetchProductById(item.productId);
      if (latestProduct && typeof latestProduct.price === "number") {
        unitPrice = latestProduct.price;
      }

      const itemSubtotal = unitPrice * item.quantity;
      verifiedSubtotal += itemSubtotal;

      return {
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal
      };
    })
  );

  const shippingCharge = calculateShippingCharge(verifiedSubtotal);
  const total = verifiedSubtotal + shippingCharge;

  // Generate unique order ID and human-friendly order number
  const ordersCollection = collection(db, "orders");
  const newOrderDocRef = doc(ordersCollection);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `DUM-${new Date().getFullYear()}-${randomSuffix}`;

  const orderData: Omit<Order, "id"> = {
    orderNumber,
    userId,
    storeId,
    storeName,
    items: verifiedItems,
    subtotal: verifiedSubtotal,
    shippingCharge,
    total,
    customerDetails,
    orderStatus: "pending",
    paymentStatus: "pending", // Payment pending / demo authorization flow
    createdAt: serverTimestamp()
  };

  await setDoc(newOrderDocRef, orderData);

  return {
    id: newOrderDocRef.id,
    ...orderData
  };
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", orderId);
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 1500)
      )
    ]);
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<Order, "id">) };
    }
    return null;
  } catch (error) {
    console.error("Error reading order by ID:", error);
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Order, "id">)
    }));
  } catch (error) {
    // If composite index is building or missing, fallback to simple query
    try {
      const ordersRef = collection(db, "orders");
      const qSimple = query(ordersRef, where("userId", "==", userId));
      const snapshot = await getDocs(qSimple);
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, "id">)
      }));
      return orders;
    } catch (fallbackError) {
      console.error("Error fetching user orders:", fallbackError);
      return [];
    }
  }
}
