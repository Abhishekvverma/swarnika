import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  cart: [],
  loading: false,
};

// Async Thunks for Firestore Writes
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item: CartItem, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const user = state.auth.user;
      if (!user) return rejectWithValue("User not logged in");

      const existingItem = state.cart.cart.find((i: CartItem) => i.id === item.id);
      const newQuantity = existingItem
        ? existingItem.quantity + item.quantity
        : item.quantity;

      const ref = doc(db, "users", user.uid, "cart", item.id);
      await setDoc(ref, {
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: newQuantity,
      });
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add to cart");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const user = state.auth.user;
      if (!user) return rejectWithValue("User not logged in");

      const ref = doc(db, "users", user.uid, "cart", id);
      await deleteDoc(ref);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove from cart");
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { id, quantity }: { id: string; quantity: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const user = state.auth.user;
      if (!user) return rejectWithValue("User not logged in");

      if (quantity <= 0) {
        dispatch(removeFromCart(id));
        return;
      }

      const ref = doc(db, "users", user.uid, "cart", id);
      await setDoc(ref, { quantity }, { merge: true });
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update quantity");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const user = state.auth.user;
      const currentCart = state.cart.cart as CartItem[];
      if (!user) return rejectWithValue("User not logged in");

      const deletePromises = currentCart.map((item) =>
        deleteDoc(doc(db, "users", user.uid, "cart", item.id))
      );
      await Promise.all(deletePromises);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCartLocal: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Optimistic updates inside pending states
      .addCase(addToCart.pending, (state, action) => {
        const item = action.meta.arg;
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          state.cart.push(item);
        }
      })
      .addCase(removeFromCart.pending, (state, action) => {
        const id = action.meta.arg;
        state.cart = state.cart.filter((i) => i.id !== id);
      })
      .addCase(updateQuantity.pending, (state, action) => {
        const { id, quantity } = action.meta.arg;
        if (quantity <= 0) {
          state.cart = state.cart.filter((i) => i.id !== id);
        } else {
          const item = state.cart.find((i) => i.id === id);
          if (item) {
            item.quantity = quantity;
          }
        }
      })
      .addCase(clearCart.pending, (state) => {
        state.cart = [];
      });
  },
});

export const { setCart, setCartLoading, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
