import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getCountFromServer,
  getDoc
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

// Get User Orders Count
export const getUserOrdersCount = async (userId: string): Promise<number> => {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

// Get User Profile Data (for loyalty points, etc.)
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

// Update User Profile Data
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  await setDoc(doc(db, "users", userId), data, { merge: true });
};

export { db };
