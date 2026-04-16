import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore — getReactNativePersistence exists in Metro's RN build of @firebase/auth
import { initializeAuth, getAuth, getReactNativePersistence } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfGa53lLv0RbCFADd4CkWaJLEHz1_BOoU",
  authDomain: "jewelry-shop-app-59a10.firebaseapp.com",
  projectId: "jewelry-shop-app-59a10",
  storageBucket: "jewelry-shop-app-59a10.firebasestorage.app",
  messagingSenderId: "418735362437",
  appId: "1:418735362437:web:575d626f882dc5195274ec",
};

// Guard against duplicate initializeApp on hot reload.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// initializeAuth throws if called more than once (e.g. on hot reload).
// try/catch falls back to getAuth() which returns the existing instance.
const getFirebaseAuth = () => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
};

export const auth = getFirebaseAuth();
export const db = getFirestore(app);
export default app;
