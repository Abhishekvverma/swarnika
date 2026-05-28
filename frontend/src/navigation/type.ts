import { NavigatorScreenParams } from "@react-navigation/native";

/**
 * Product Model
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  purity?: string;
  weight?: number;
  makingCharges?: number;
  stoneCharges?: number;
  totalPrice?: number;
  description?: string;
  gender?: string;
}

/**
 * Bottom Tabs
 */
export type BottomTabParamList = {
  Home: undefined;
  Shop: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

/**
 * Root Stack — single flat navigator used by RootNavigator.
 *
 * All screens (splash, onboarding, auth, and app) live here.
 *
 * Flow:
 *   Unauthorized:  Splash → Intro → Signup (→ Signin) → MainTabs
 *   Authenticated: Splash → MainTabs
 */
export type RootStackParamList = {
  // ── Splash ──────────────────────────────────────────────────────────
  Splash: undefined;

  // ── Unauthenticated flow ─────────────────────────────────────────────
  Intro: undefined;
  Signup: undefined;
  Signin: undefined;

  // ── Authenticated / App screens ──────────────────────────────────────
  MainTabs: NavigatorScreenParams<BottomTabParamList> | undefined;
  Categories: undefined;
  CategoryDetail: { categoryName: string };
  Search: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout: undefined;
  PersonalDetails: undefined;
  SavedAddresses: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  HelpCenter: undefined;
  MetalRates: undefined;
};

/**
 * Legacy type aliases kept for backwards-compat if any screen still imports them.
 * Prefer RootStackParamList going forward.
 */
export type AuthStackParamList = Pick<RootStackParamList, "Signin" | "Signup">;
export type AppStackParamList = Pick<
  RootStackParamList,
  "MainTabs" | "Categories" | "CategoryDetail" | "Search" | "ProductDetail" | "Cart" | "Checkout"
>;