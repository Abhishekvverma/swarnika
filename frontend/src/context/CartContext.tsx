import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AuthContext } from "./AuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  totalItems: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  loading: false,
  totalItems: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Real-time sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    setLoading(true);
    const ref = collection(db, "users", user.uid, "cart");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const items: CartItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CartItem, "id">),
      }));
      setCart(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = useCallback(
    async (item: CartItem) => {
      if (!user) return; // Optional: prompt user to login if guest

      const existingItem = cart.find((i) => i.id === item.id);
      const newQuantity = existingItem
        ? existingItem.quantity + item.quantity
        : item.quantity;

      const ref = doc(db, "users", user.uid, "cart", item.id);

      // Optimistic Update
      if (existingItem) {
        setCart((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
      } else {
        setCart((prev) => [...prev, item]);
      }

      // Sync Firestore
      try {
        await setDoc(ref, {
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: newQuantity,
        });
      } catch (err) {
        console.error("Failed to add to cart:", err);
        // On failure, rely on Firebase to sync the actual previous state during next snapshot
      }
    },
    [user, cart]
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "cart", id);
      
      // Optimistic update
      setCart((prev) => prev.filter((i) => i.id !== id));

      try {
        await deleteDoc(ref);
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (!user) return;
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      const ref = doc(db, "users", user.uid, "cart", id);

      // Optimistic update
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );

      try {
        await setDoc(ref, { quantity }, { merge: true });
      } catch (err) {
        console.error("Failed to update cart quantity:", err);
      }
    },
    [user, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    if (!user) return;
    
    // Optimistic update
    const previousCart = [...cart];
    setCart([]);

    try {
      const deletePromises = previousCart.map((item) =>
        deleteDoc(doc(db, "users", user.uid, "cart", item.id))
      );
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setCart(previousCart); // Rollback
    }
  }, [user, cart]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
