import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutUser } from "../../firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isFirstLaunch: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  isFirstLaunch: false,
};

export const finishOnboarding = createAsyncThunk(
  "auth/finishOnboarding",
  async () => {
    await AsyncStorage.setItem("alreadyLaunched", "true");
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    await logoutUser();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIsFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(finishOnboarding.fulfilled, (state) => {
      state.isFirstLaunch = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { setUser, setLoading, setIsFirstLaunch } = authSlice.actions;
export default authSlice.reducer;
