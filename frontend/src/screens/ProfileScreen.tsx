import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/type";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RECENT_ORDERS = [
  {
    id: "ORD-1234",
    title: "Solitaire Diamond Ring",
    date: "April 2, 2026",
    status: "Delivered",
  },
  {
    id: "ORD-1235",
    title: "Classic Gold Band",
    date: "March 15, 2026",
    status: "Processing",
  },
];

const MENU_ITEMS = [
  { icon: "person-outline", title: "Personal Details", route: "PersonalDetails" },
  { icon: "card-outline", title: "Payment Methods", route: "PaymentMethods" },
  { icon: "location-outline", title: "Saved Addresses", route: "SavedAddresses" },
  { icon: "notifications-outline", title: "Notifications", route: "Notifications" },
  { icon: "help-buoy-outline", title: "Help & Support", route: null },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { user, logout } = useContext(AuthContext);
  
  const defaultAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80";
  const [avatarUri, setAvatarUri] = useState<string>(user?.photoURL || defaultAvatar);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      // Here you might want to wrap uploading to Firebase Storage and updating auth profile
      // await uploadImageToFirebase(result.assets[0].uri);
    }
  };

  const handleMenuPress = (route: string | null) => {
      if (route) {
          // @ts-ignore
          navigation.navigate(route);
      } else {
          Alert.alert("Coming Soon", "This section is under development.");
      }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "No email available";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFILE</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* User Info Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.editBadge}>
                <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
            <Text style={styles.memberText}>
              Member since 2026
            </Text>
          </View>
        </View>

        {/* Orders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {RECENT_ORDERS.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <View style={styles.orderIconBg}>
                  <Ionicons name="cube-outline" size={20} color="#000" />
                </View>
                <View>
                  <Text style={styles.orderTitle}>{order.title}</Text>
                  <Text style={styles.orderId}>{order.id} • {order.date}</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.orderStatus,
                  { color: order.status === "Delivered" ? "#4CAF50" : "#F57C00" },
                ]}
              >
                {order.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMenuPress(item.route)}
                style={[
                  styles.menuItem,
                  index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#555" />
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#000",
  },
  content: {
    padding: 16,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  avatarContainer: {
      position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
  },
  editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#1A1A1A',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFF',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  memberText: {
    fontSize: 12,
    color: "#D4AF37",
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 13,
    color: "#D4AF37",
    fontWeight: "600",
  },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  orderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 12,
    color: "#888",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FAFAFA",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 16,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ffebee",
  },
  logoutText: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "600",
    marginLeft: 8,
  },
});
