export interface LocationItem {
  id: string;
  locationCode: string; // e.g. "CHN-01", "BLR-02"
  locationName: string; // e.g. "Chennai Central", "Bangalore East"
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface AreaItem {
  id: string;
  locationId: string; // Lookup ID pointing to LocationItem.id
  locationCode?: string;
  locationName?: string; // Cached for quick rendering
  areaName: string; // e.g. "Anna Nagar", "Indiranagar"
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface ShopItem {
  id: string;
  shopLegalName: string; // e.g. "DumDum Donut Factory Pvt Ltd"
  reqNo: string; // Registration/Request No e.g. "REQ-2026-081"
  ownerName: string; // e.g. "Varatharaj"
  shopTelNumber: string; // e.g. "044-24567890"
  ownerMobileNumber: string; // e.g. "+91 98765 43210"
  paymentMobileNumber: string; // e.g. "+91 98765 43210" for UPI / Settlements
  locationId: string; // Lookup to LocationItem.id
  locationName?: string; // Cached lookup name
  areaId?: string; // Optional Area lookup
  areaName?: string; // Cached area name
  detailedAddress: string; // Text area
  paymentPercentage: number; // e.g. 5.5
  minimumOrderAmount: number; // e.g. 150
  rating?: number; // e.g. 4.8 or 5.0
  status?: "active" | "inactive" | "pending";
  createdAt?: any;
  updatedAt?: any;
}

export const ADMIN_COLLECTIONS = {
  LOCATIONS: "locations",
  AREAS: "areas",
  SHOPS: "shops",
} as const;
