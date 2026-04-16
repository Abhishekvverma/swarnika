import React, { useContext, useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from "../context/AuthContext";

/**
 * SplashScreen
 *
 * Shown EVERY TIME the app starts (for both authenticated and
 * unauthenticated users).
 *
 * Navigation decision after the timer:
 *   • Authenticated user  →  replace with "MainTabs" (Home)
 *   • Unauthenticated user →  replace with "Intro"
 *
 * We use `navigation.replace` so the splash is removed from the stack;
 * pressing back can never return to it.
 */

// Use `any` so the single SplashScreen component can navigate to screens
// from both the auth and app stacks without TypeScript complaints.
type SplashNavProp = NativeStackNavigationProp<any>;

const SPLASH_DURATION_MS = 3000;

const SplashScreen = () => {
  // `loading` is true while Firebase is still resolving the persisted session.
  // We wait for it to resolve before deciding where to go.
  const { user, loading } = useContext(AuthContext);
  const navigation = useNavigation<SplashNavProp>();

  useEffect(() => {
    // Wait until Firebase has fully resolved the persisted auth session.
    // `user` is already the correct final value at this point — no race.
    if (loading) return;

    const timer = setTimeout(() => {
      if (user) {
        // ── Already signed in → skip onboarding, go straight to Home ──
        navigation.replace("MainTabs");
      } else {
        // ── New / signed-out user → start the onboarding flow ──────────
        navigation.replace("Intro");
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);

    // ⚠️  Intentionally omit `user` and `navigation` from deps.
    // We only want this to fire ONCE — the moment `loading` becomes false.
    // At that exact instant, `user` already holds the Firebase-resolved value.
    // Including `user` would cause a double-navigation if Firebase resolves
    // user slightly after loading flips (timer → Intro, then immediately → MainTabs).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 220,
    height: 220,
  },
});