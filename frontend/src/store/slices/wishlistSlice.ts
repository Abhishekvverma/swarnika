import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface WishlistItem {
  id: string;
  name: string;
  price: number | string;
  image: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
};

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (item: WishlistItem, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const user = state.auth.user;
      if (!user) return rejectWithValue("User not logged in");

      const alreadyWishlisted = state.wishlist.wishlist.some(
        (w: WishlistItem) => w.id === item.id
      );
      const ref = doc(db, "users", user.uid, "wishlist", item.id);

      if (alreadyWishlisted) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, {
          name: item.name,
          price: item.price,
          image: item.image,
        });
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to toggle wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlist = action.payload;
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearWishlistLocal: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleWishlist.pending, (state, action) => {
      const item = action.meta.arg;
      const index = state.wishlist.findIndex((w) => w.id === item.id);
      if (index >= 0) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(item);
      }
    });
  },
});

export const { setWishlist, setWishlistLoading, clearWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
