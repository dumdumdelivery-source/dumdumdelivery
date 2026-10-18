import { collection, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Store, Product } from "../types";

export const INITIAL_STORES: Omit<Store, "id">[] = [
  {
    name: "DumDum Donut Factory",
    slug: "dumdum-donut-factory",
    description: "Freshly glazed donuts, cinnamon rolls, and gourmet cream-filled rings made daily.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    rating: 4.9,
    deliveryEstimate: "20-30 mins",
    category: "Bakery & Donuts",
    locationId: "loc_maa_01",
    locationName: "Chennai Metropolitan",
    locationCode: "MAA-01",
    location: {
      id: "loc_maa_01",
      locationId: "loc_maa_01",
      locationCode: "MAA-01",
      locationName: "Chennai Metropolitan"
    }
  },
  {
    name: "Boba & Dim Sum Club",
    slug: "boba-dim-sum-club",
    description: "Steaming hot dumplings, spicy crystal momos, and chilled brown sugar boba teas.",
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    rating: 4.8,
    deliveryEstimate: "25-35 mins",
    category: "Dim Sum & Teas",
    locationId: "loc_blr_01",
    locationName: "Bangalore Urban",
    locationCode: "BLR-01",
    location: {
      id: "loc_blr_01",
      locationId: "loc_blr_01",
      locationCode: "BLR-01",
      locationName: "Bangalore Urban"
    }
  },
  {
    name: "SugarPop Candy Carnival",
    slug: "sugarpop-candy-carnival",
    description: "Vibrant gummy bursts, rainbow sour belts, candy apples, and imported sweet boxes.",
    imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    rating: 4.95,
    deliveryEstimate: "15-25 mins",
    category: "Candy & Confections",
    locationId: "loc_maa_01",
    locationName: "Chennai Metropolitan",
    locationCode: "MAA-01",
    location: {
      id: "loc_maa_01",
      locationId: "loc_maa_01",
      locationCode: "MAA-01",
      locationName: "Chennai Metropolitan"
    }
  },
  {
    name: "ChocoLuxe Artisan Patisserie",
    slug: "chocoluxe-artisan-patisserie",
    description: "Decadent Belgian chocolate truffles, strawberry tarts, and velvety mousse cups.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    rating: 4.85,
    deliveryEstimate: "30-40 mins",
    category: "Chocolates & Pastries",
    locationId: "loc_cbe_01",
    locationName: "Coimbatore Central",
    locationCode: "CBE-01",
    location: {
      id: "loc_cbe_01",
      locationId: "loc_cbe_01",
      locationCode: "CBE-01",
      locationName: "Coimbatore Central"
    }
  }
];

export const INITIAL_PRODUCTS: (Omit<Product, "id" | "storeId"> & { storeSlug: string })[] = [
  // DumDum Donut Factory
  {
    storeSlug: "dumdum-donut-factory",
    name: "Golden Caramel Crunch Donut",
    description: "Fluffy brioche ring dipped in salted butter caramel, sprinkled with honeycomb crunches.",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    storeName: "DumDum Donut Factory",
    stock: 18,
    category: "Donuts",
    isActive: true
  },
  {
    storeSlug: "dumdum-donut-factory",
    name: "Triple Chocolate Lava Ring",
    description: "Rich dark cocoa dough filled with molten chocolate ganache and chocolate curls.",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    storeName: "DumDum Donut Factory",
    stock: 25,
    category: "Donuts",
    isActive: true
  },
  {
    storeSlug: "dumdum-donut-factory",
    name: "Strawberry Sprinkles Dream",
    description: "Strawberry glaze topped with colorful candy confetti on our signature pillowy dough.",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=800&q=80",
    storeName: "DumDum Donut Factory",
    stock: 30,
    category: "Donuts",
    isActive: true
  },
  {
    storeSlug: "dumdum-donut-factory",
    name: "Glazed Cinnamon Twist Box (Pack of 4)",
    description: "Warm hand-twisted dough dusted with organic Ceylon cinnamon and Madagascar vanilla glaze.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    storeName: "DumDum Donut Factory",
    stock: 12,
    category: "Donuts",
    isActive: true
  },

  // Boba & Dim Sum Club
  {
    storeSlug: "boba-dim-sum-club",
    name: "Steamed Crystal Veg Dumplings (6 pcs)",
    description: "Translucent dumpling skins filled with water chestnuts, shiitake mushrooms, and fresh scallions.",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
    storeName: "Boba & Dim Sum Club",
    stock: 20,
    category: "Dim Sum",
    isActive: true
  },
  {
    storeSlug: "boba-dim-sum-club",
    name: "Fiery Schezwan Chilli Momos (8 pcs)",
    description: "Pan-tossed dumplings coated in our house spicy chilli garlic and pepper glaze.",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80",
    storeName: "Boba & Dim Sum Club",
    stock: 15,
    category: "Dim Sum",
    isActive: true
  },
  {
    storeSlug: "boba-dim-sum-club",
    name: "Tiger Brown Sugar Boba Milk",
    description: "Slow-cooked tapioca pearls, caramelised brown sugar tiger stripes, and chilled rich fresh milk.",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1558857563-b37fe78a9462?auto=format&fit=crop&w=800&q=80",
    storeName: "Boba & Dim Sum Club",
    stock: 40,
    category: "Boba Tea",
    isActive: true
  },
  {
    storeSlug: "boba-dim-sum-club",
    name: "Uji Matcha Latte with Honey Boba",
    description: "Authentic Kyoto green tea whisked with silky milk and natural honey-infused chewy boba.",
    price: 169,
    imageUrl: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",
    storeName: "Boba & Dim Sum Club",
    stock: 25,
    category: "Boba Tea",
    isActive: true
  },

  // SugarPop Candy Carnival
  {
    storeSlug: "sugarpop-candy-carnival",
    name: "Rainbow Gummy Bear Party Jar (250g)",
    description: "Juicy fruit gummies bursting with cherry, green apple, peach, and tangy lemon flavors.",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80",
    storeName: "SugarPop Candy Carnival",
    stock: 50,
    category: "Gummies",
    isActive: true
  },
  {
    storeSlug: "sugarpop-candy-carnival",
    name: "Fizzy Sour Rainbow Belts (150g)",
    description: "Mouth-puckering sour sugar crystals dusting sweet rainbow fruit strips.",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=800&q=80",
    storeName: "SugarPop Candy Carnival",
    stock: 35,
    category: "Sour Candy",
    isActive: true
  },
  {
    storeSlug: "sugarpop-candy-carnival",
    name: "Giant Swirl Candy Lollipop",
    description: "Handcrafted old-fashioned carnival lollipop with vivid fruit twist layers.",
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=800&q=80",
    storeName: "SugarPop Candy Carnival",
    stock: 60,
    category: "Lollipops",
    isActive: true
  },

  // ChocoLuxe Artisan Patisserie
  {
    storeSlug: "chocoluxe-artisan-patisserie",
    name: "Belgian Dark Truffle Mousse Cup",
    description: "Layered 70% dark chocolate mousse with crisp praline pearls and cocoa dusting.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    storeName: "ChocoLuxe Artisan Patisserie",
    stock: 14,
    category: "Pastries",
    isActive: true
  },
  {
    storeSlug: "chocoluxe-artisan-patisserie",
    name: "Fresh Strawberry Mascarpone Tart",
    description: "Buttery sable crust filled with vanilla bean mascarpone and glazed winter strawberries.",
    price: 219,
    imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    storeName: "ChocoLuxe Artisan Patisserie",
    stock: 10,
    category: "Tarts",
    isActive: true
  },
  {
    storeSlug: "chocoluxe-artisan-patisserie",
    name: "Red Velvet Cheesecake Slice",
    description: "Classic crimson sponge swirled with Philadelphia cream cheese and white chocolate cream.",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1616031037011-0872601579be?auto=format&fit=crop&w=800&q=80",
    storeName: "ChocoLuxe Artisan Patisserie",
    stock: 12,
    category: "Cakes",
    isActive: true
  }
];

export async function seedFirestoreDatabase(force: boolean = false): Promise<{ seeded: boolean; message: string }> {
  try {
    const storesCol = collection(db, "stores");
    const existingStores = await getDocs(storesCol);

    if (!force && existingStores.size > 0) {
      return {
        seeded: false,
        message: `Database already has ${existingStores.size} stores.`
      };
    }

    const batch = writeBatch(db);
    const storeMap = new Map<string, string>(); // slug -> docId

    for (const storeData of INITIAL_STORES) {
      const storeRef = doc(storesCol);
      batch.set(storeRef, {
        ...storeData,
        createdAt: serverTimestamp()
      });
      storeMap.set(storeData.slug, storeRef.id);
    }

    const productsCol = collection(db, "products");
    for (const prodData of INITIAL_PRODUCTS) {
      const storeId = storeMap.get(prodData.storeSlug);
      if (!storeId) continue;

      const prodRef = doc(productsCol);
      const { storeSlug, ...rest } = prodData;
      batch.set(prodRef, {
        ...rest,
        storeId,
        createdAt: serverTimestamp()
      });
    }

    await batch.commit();
    return {
      seeded: true,
      message: `Successfully seeded ${INITIAL_STORES.length} stores and ${INITIAL_PRODUCTS.length} products.`
    };
  } catch (error: any) {
    console.error("Error seeding Firestore:", error);
    return {
      seeded: false,
      message: error?.message || "Failed to seed Firestore"
    };
  }
}
