import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "./src/store";
import FirestoreSync from "./src/components/FirestoreSync";
import RootNavigator from "./src/navigation/RootNavigator";
import { requestNotificationPermissions } from "./src/services/NotificationService";
import { ThemeProvider } from "./src/theme/ThemeContext";

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
    <ReduxProvider store={store}>
      <FirestoreSync />
      <ThemeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </ReduxProvider>
  );
}
