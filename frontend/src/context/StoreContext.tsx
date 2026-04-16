import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getProducts, getCategories, getBanners } from "../firebase/firestore";
import { Product, Category, Banner } from "../firebase/types";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

export const StoreContext = createContext<StoreContextType>({
  products: [],
  categories: [],
  banners: [],
  loading: true,
  refreshData: async () => {},
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedProducts, fetchedCategories, fetchedBanners] = await Promise.all([
        getProducts(),
        getCategories(),
        getBanners()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setBanners(fetchedBanners);
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StoreContext.Provider value={{ products, categories, banners, loading, refreshData: fetchData }}>
      {children}
    </StoreContext.Provider>
  );
};
