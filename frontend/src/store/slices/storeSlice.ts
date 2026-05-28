import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getCategories, getBanners } from "../../firebase/firestore";
import { Product, Category, Banner } from "../../firebase/types";

interface StoreState {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  loading: boolean;
}

const initialState: StoreState = {
  products: [],
  categories: [],
  banners: [],
  loading: true,
};

export const fetchStoreData = createAsyncThunk(
  "store/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const [products, categories, banners] = await Promise.all([
        getProducts(),
        getCategories(),
        getBanners()
      ]);
      return { products, categories, banners };
    } catch (error: any) {
      console.error("Error fetching store data in Redux:", error);
      return rejectWithValue(error.message || "Failed to fetch store data");
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreData.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.banners = action.payload.banners;
        state.loading = false;
      })
      .addCase(fetchStoreData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default storeSlice.reducer;
