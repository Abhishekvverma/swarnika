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

export interface WishlistItem {
  id: string;
  name: string;
  price: number | string;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  loading: boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isWishlisted: () => false,
  toggleWishlist: async () => {},
  loading: false,
});

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Real-time sync with Firestore when user is logged in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    const ref = collection(db, "users", user.uid, "wishlist");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const items: WishlistItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<WishlistItem, "id">),
      }));
      setWishlist(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isWishlisted = useCallback(
    (id: string) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (item: WishlistItem) => {
      if (!user) return;

      const alreadyWishlisted = isWishlisted(item.id);
      const ref = doc(db, "users", user.uid, "wishlist", item.id);

      // ── Optimistic update: flip state instantly so heart fills/empties immediately ──
      if (alreadyWishlisted) {
        setWishlist((prev) => prev.filter((w) => w.id !== item.id));
      } else {
        setWishlist((prev) => [...prev, item]);
      }

      // ── Persist to Firestore in the background ──
      try {
        if (alreadyWishlisted) {
          await deleteDoc(ref);
        } else {
          await setDoc(ref, {
            name: item.name,
            price: item.price,
            image: item.image,
          });
        }
      } catch {
        // Rollback on failure
        if (alreadyWishlisted) {
          setWishlist((prev) => [...prev, item]);
        } else {
          setWishlist((prev) => prev.filter((w) => w.id !== item.id));
        }
      }
    },
    [user, isWishlisted]
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, isWishlisted, toggleWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
