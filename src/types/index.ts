import type { Timestamp, FieldValue } from "firebase/firestore";

export interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  phoneNumber: string;
  deliveryAddress: DeliveryAddress;
  profileCompleted: boolean;
  createdAt?: Timestamp | FieldValue | string | null;
  updatedAt?: Timestamp | FieldValue | string | null;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  rating?: number;
  deliveryEstimate?: string;
  category?: string;
  locationId?: string;
  locationName?: string;
  locationCode?: string;
  location?: {
    id?: string;
    locationId?: string;
    locationCode: string;
    locationName: string;
  };
  createdAt?: Timestamp | FieldValue | string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeId: string;
  storeName: string;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt?: Timestamp | FieldValue | string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  storeId: string;
  storeName: string;
  quantity: number;
  stock: number;
}

export interface StoreCartGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  freeShippingRemaining: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  customerDetails: {
    name: string;
    phoneNumber: string;
    deliveryAddress: DeliveryAddress;
  };
  orderStatus: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: "pending" | "demo_authorized" | "paid" | "failed";
  createdAt: Timestamp | FieldValue | string | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
