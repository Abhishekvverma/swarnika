import React, { createContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, logoutUser } from "../firebase/auth";
import { registerForPushNotificationsAsync } from "../utils/notifications";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirstLaunch: boolean;
  logout: () => Promise<void>;
  finishOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    // Safety timeout: if Firebase auth doesn't resolve in 5s (e.g. init crash,
    // offline, etc.) force loading=false so the splash can still navigate.
    const timeout = setTimeout(() => setLoading(false), 5000);

    const checkAuthAndLaunch = async () => {
      // Check first launch
      const value = await AsyncStorage.getItem("alreadyLaunched");
      if (!value) setIsFirstLaunch(true);

      // Listen to Firebase auth — fires immediately with cached user if
      // AsyncStorage persistence is working correctly.
      onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(timeout);
        setUser(firebaseUser);
        setLoading(false);

        if (firebaseUser) {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            import("../firebase/firestore").then(({ updateUserPushToken }) => {
              updateUserPushToken(firebaseUser.uid, token).catch(e => console.log('Failed to save push token', e));
            });
          }
        }
      });
    };

    checkAuthAndLaunch();

    return () => clearTimeout(timeout);
  }, []);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("alreadyLaunched", "true");
    setIsFirstLaunch(false);
  };

  const logout = async () => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLaunch, logout, finishOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};
