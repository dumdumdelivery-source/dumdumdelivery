import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../lib/firebase";
import type { UserProfile } from "../types";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error reading user profile from Firestore:", error);
    return null;
  }
}

export async function extractPhoneNumberFromGoogle(
  user: User,
  accessToken?: string
): Promise<string> {
  // 1. Check direct Firebase Auth User properties
  if (user.phoneNumber) return user.phoneNumber;

  // 2. Check providerData
  for (const provider of user.providerData) {
    if (provider.phoneNumber) return provider.phoneNumber;
  }

  // 3. If OAuth accessToken is present from Google Sign-In, query Google People API
  if (accessToken) {
    try {
      const res = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        const primary =
          data.phoneNumbers?.find((p: any) => p.metadata?.primary)?.value ||
          data.phoneNumbers?.[0]?.value;
        if (primary && typeof primary === "string") {
          return primary.trim();
        }
      }
    } catch (apiErr) {
      console.warn("Could not retrieve phone number from Google People API:", apiErr);
    }
  }

  return "";
}

export async function createOrUpdateInitialProfile(
  user: User,
  discoveredPhone?: string
): Promise<UserProfile> {
  const docRef = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const existing = snap.data() as UserProfile;
      const updates: Partial<UserProfile> = {};

      // Sync photoURL if updated in Google account
      if (user.photoURL && user.photoURL !== existing.photoURL) {
        updates.photoURL = user.photoURL;
        existing.photoURL = user.photoURL;
      }

      // If existing profile has no phone number, but one was discovered from Google, sync it!
      if (!existing.phoneNumber && discoveredPhone) {
        updates.phoneNumber = discoveredPhone;
        existing.phoneNumber = discoveredPhone;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      }

      return existing;
    }

    const newProfile: UserProfile = {
      uid: user.uid,
      name: user.displayName || "Valued Customer",
      email: user.email || "",
      photoURL: user.photoURL || "",
      phoneNumber: discoveredPhone || user.phoneNumber || "",
      deliveryAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: ""
      },
      profileCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, newProfile);
    return newProfile;
  } catch (error) {
    console.error("Error saving initial user profile:", error);
    // Return a working in-memory profile if Firestore write is blocked
    return {
      uid: user.uid,
      name: user.displayName || "Valued Customer",
      email: user.email || "",
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
      phoneNumber: "",
      deliveryAddress: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: ""
      },
      profileCompleted: false
    };
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
}
