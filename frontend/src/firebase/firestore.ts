import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import app  from "./config";
import { Product, Order, Category, Banner, UserProfile } from "./types";

const db = getFirestore(app);

// Get Products
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

// Add Order
export const createOrder = async (order: Order): Promise<void> => {
  await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
  });
};

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

export const getBanners = async (): Promise<Banner[]> => {
  const snapshot = await getDocs(collection(db, "banners"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Banner[];
};

export const createUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  await setDoc(doc(db, "users", userId), {
    ...data,
    role: "user",
    createdAt: serverTimestamp(),
  });
};

export const updateUserPushToken = async (userId: string, pushToken: string): Promise<void> => {
  await setDoc(doc(db, "users", userId), {
    pushToken,
  }, { merge: true });
};

export { db };
