import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase/auth";
import { db } from "../firebase/config";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { useAppDispatch } from "../store/hooks";
import { setUser, setLoading, setIsFirstLaunch } from "../store/slices/authSlice";
import { setCart, clearCartLocal } from "../store/slices/cartSlice";
import { setWishlist, clearWishlistLocal } from "../store/slices/wishlistSlice";

export const FirestoreSync: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Safety timeout: if Firebase auth doesn't resolve in 5s, force loading=false
    const timeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 5000);

    let unsubscribeCart: (() => void) | null = null;
    let unsubscribeWishlist: (() => void) | null = null;

    const checkAuthAndLaunch = async () => {
      // 1. Check first launch onboarding
      try {
        const launchedValue = await AsyncStorage.getItem("alreadyLaunched");
        if (!launchedValue) {
          dispatch(setIsFirstLaunch(true));
        }
      } catch (err) {
        console.error("AsyncStorage error checking launched state:", err);
      }

      // 2. Subscribe to Auth changes
      onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(timeout);

        if (firebaseUser) {
          // Serialize Firebase User to avoid serializable warning in Redux state
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            })
          );

          // 3. Sync Cart in real-time
          const cartRef = collection(db, "users", firebaseUser.uid, "cart");
          unsubscribeCart = onSnapshot(
            cartRef,
            (snapshot) => {
              const items = snapshot.docs.map((d) => ({
                id: d.id,
                name: d.data().name || "",
                price: d.data().price || 0,
                image: d.data().image || "",
                quantity: d.data().quantity || 1,
              }));
              dispatch(setCart(items));
            },
            (error) => {
              console.error("Real-time cart sync error:", error);
            }
          );

          // 4. Sync Wishlist in real-time
          const wishlistRef = collection(db, "users", firebaseUser.uid, "wishlist");
          unsubscribeWishlist = onSnapshot(
            wishlistRef,
            (snapshot) => {
              const items = snapshot.docs.map((d) => ({
                id: d.id,
                name: d.data().name || "",
                price: d.data().price || 0,
                image: d.data().image || "",
              }));
              dispatch(setWishlist(items));
            },
            (error) => {
              console.error("Real-time wishlist sync error:", error);
            }
          );

          // 5. Handle Push Token registration
          try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
              const { updateUserPushToken } = await import("../firebase/firestore");
              await updateUserPushToken(firebaseUser.uid, token);
            }
          } catch (pushErr) {
            console.log("Failed to register/update push notifications token:", pushErr);
          }
        } else {
          // No user: clear all state and stop subscriptions
          dispatch(setUser(null));
          dispatch(clearCartLocal());
          dispatch(clearWishlistLocal());

          if (unsubscribeCart) {
            unsubscribeCart();
            unsubscribeCart = null;
          }
          if (unsubscribeWishlist) {
            unsubscribeWishlist();
            unsubscribeWishlist = null;
          }
        }

        dispatch(setLoading(false));
      });
    };

    checkAuthAndLaunch();

    return () => {
      clearTimeout(timeout);
      if (unsubscribeCart) unsubscribeCart();
      if (unsubscribeWishlist) unsubscribeWishlist();
    };
  }, [dispatch]);

  return null; // Side-effect only component
};

export default FirestoreSync;
