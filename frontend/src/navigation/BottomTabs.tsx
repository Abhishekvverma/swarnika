import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ShopScreen from "../screens/ShopScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { BottomTabParamList } from "../navigation/type";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#C9A14A",
        tabBarInactiveTintColor: "#999",
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Ionicons name="home-outline" size={size} color={color} />;
            case "Shop":
              return <Feather name="grid" size={size} color={color} />;
            case "Wishlist":
              return <Feather name="heart" size={size} color={color} />;
            case "Profile":
              return <Feather name="user" size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
