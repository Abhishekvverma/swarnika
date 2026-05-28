import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./type";

// Screens
import SplashScreen from "../screens/SplashScreen";
import IntroScreen from "../screens/IntroScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import BottomTabs from "./BottomTabs";
import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryDetailScreen from "../screens/CategoryDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import PersonalDetailsScreen from "../screens/PersonalDetailsScreen";
import SavedAddressesScreen from "../screens/SavedAddressesScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import HelpCenterScreen from "../screens/HelpCenterScreen";
import MetalRatesScreen from "../screens/MetalRatesScreen";

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * All screens are registered unconditionally so every route is always
 * available to the navigator, regardless of auth state.
 *
 * Auth flow is enforced by NAVIGATION, not by toggling the screen registry:
 *   • SplashScreen reads auth state once and uses replace() to route correctly.
 *   • SignupScreen / SigninScreen use replace("MainTabs") after success.
 *   • Back navigation is blocked by gestureEnabled:false + replace() (no stack history).
 *
 * Why NOT conditional screen registration?
 *   When navigation.replace("MainTabs") is called (e.g. from SignupScreen),
 *   onAuthStateChanged may not have fired yet, so user is still null in
 *   AuthContext → MainTabs would not be registered → navigation crashes.
 */
export default function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {/* ── Entry point ── */}
      <RootStack.Screen name="Splash" component={SplashScreen} />

      {/* ── Unauthenticated flow ── */}
      <RootStack.Screen name="Intro" component={IntroScreen} />
      <RootStack.Screen name="Signup" component={SignupScreen} />
      <RootStack.Screen name="Signin" component={SigninScreen} />

      {/* ── Authenticated / App screens ── */}
      <RootStack.Screen name="MainTabs" component={BottomTabs} />
      <RootStack.Screen name="Categories" component={CategoriesScreen} />
      <RootStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <RootStack.Screen name="Search" component={SearchScreen} />
      <RootStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <RootStack.Screen name="Cart" component={CartScreen} />
      <RootStack.Screen name="Checkout" component={CheckoutScreen} />
      <RootStack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <RootStack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <RootStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />
      <RootStack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <RootStack.Screen name="MetalRates" component={MetalRatesScreen} />
    </RootStack.Navigator>
  );
}