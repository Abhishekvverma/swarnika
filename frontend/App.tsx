import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";

import { AuthProvider } from "./src/context/AuthContext";
import { WishlistProvider } from "./src/context/WishlistContext";
import { CartProvider } from "./src/context/CartContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { requestNotificationPermissions } from "./src/services/NotificationService";

import { StoreProvider } from "./src/context/StoreContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  if (!fontsLoaded) {
    return null; // or splash screen
  }

  return (
    <AuthProvider>
      <StoreProvider>
        <WishlistProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </WishlistProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
