import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import {
  getUserProfile,
  createOrUpdateInitialProfile,
  updateUserProfile,
  extractPhoneNumberFromGoogle
} from "../services/userService";
import type { UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Process redirect sign-in outcome if user used redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const accessToken = credential?.accessToken;
          const discoveredPhone = await extractPhoneNumberFromGoogle(result.user, accessToken);
          const userProf = await createOrUpdateInitialProfile(result.user, discoveredPhone);
          setProfile(userProf);
        }
      })
      .catch((err) => {
        console.warn("Redirect result check:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const discoveredPhone = await extractPhoneNumberFromGoogle(currentUser);
          const userProf = await createOrUpdateInitialProfile(currentUser, discoveredPhone);
          setProfile(userProf);
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const discoveredPhone = await extractPhoneNumberFromGoogle(result.user, accessToken);
        const userProf = await createOrUpdateInitialProfile(result.user, discoveredPhone);
        setProfile(userProf);
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const signInWithGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Google Sign-In Redirect Error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign Out Error:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const updated = await getUserProfile(user.uid);
      if (updated) {
        setProfile(updated);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("Must be logged in to update profile");
    await updateUserProfile(user.uid, data);
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithGoogleRedirect,
        signOutUser,
        refreshProfile,
        saveProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
