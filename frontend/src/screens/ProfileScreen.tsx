import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/type";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../theme/ThemeContext";
import { Switch } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { getUserOrdersCount, getUserProfile, updateUserProfile } from "../firebase/firestore";
import { useEffect } from "react";
import { Fonts } from "../constants/fonts";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: string;
  title: string;
  route: string | null;
  value?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "ACCOUNT",
    items: [
      { icon: "person-outline", title: "Personal Details", route: "PersonalDetails" },
      { icon: "location-outline", title: "Saved Addresses", route: "SavedAddresses" },
      { icon: "card-outline", title: "Payment Methods", route: "PaymentMethods" },
      { icon: "bag-check-outline", title: "Order History", route: null },
    ]
  },
  {
    title: "PREFERENCES",
    items: [
      { icon: "notifications-outline", title: "Notifications", route: "Notifications" },
      { icon: "analytics-outline", title: "Live Metal Rates & Calculator", route: "MetalRates" },
      { icon: "globe-outline", title: "Language", value: "English", route: null },
      { icon: "cash-outline", title: "Currency", value: "INR (₹)", route: null },
    ]
  },
  {
    title: "SUPPORT",
    items: [
      { icon: "help-circle-outline", title: "Help Center", route: "HelpCenter" },
      { icon: "information-circle-outline", title: "About Swarnika", route: null },
      { icon: "shield-checkmark-outline", title: "Privacy Policy", route: null },
    ]
  }
];

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { theme, colors, toggleTheme } = useTheme();
  
  const [orderCount, setOrderCount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [firestoreUsername, setFirestoreUsername] = useState("");

  const defaultAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80";
  const [avatarUri, setAvatarUri] = useState<string>(user?.photoURL || defaultAvatar);

  useEffect(() => {
    if (user) {
      // Fetch dynamic stats and user profile details from Firestore
      getUserOrdersCount(user.uid).then(setOrderCount);
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          if ((profile as any).loyaltyPoints) {
            setLoyaltyPoints((profile as any).loyaltyPoints);
          }
          if (profile.username) {
            setFirestoreUsername(profile.username);
          }
          if (profile.avatar) {
            setAvatarUri(profile.avatar);
          }
        }
      });
    }
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await dispatch(logout()).unwrap();
              navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
            } catch (e) { console.log(e); }
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setAvatarUri(selectedUri);
      if (user) {
        try {
          await updateUserProfile(user.uid, { avatar: selectedUri });
        } catch (e) {
          console.error("Failed to save avatar image to Firestore profile:", e);
        }
      }
    }
  };

  const displayName = firestoreUsername || user?.displayName || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "No email available";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={[styles.topSection, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
             <Text style={[styles.headerTitle, { color: colors.text }]}>MY PROFILE</Text>
             <TouchableOpacity style={styles.settingsIcon}>
                <Ionicons name="settings-outline" size={22} color={colors.text} />
             </TouchableOpacity>
          </View>

          <View style={styles.userMainInfo}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
               <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.background }]} />
               <View style={[styles.cameraBtn, { backgroundColor: colors.primary, borderColor: colors.card }]}>
                  <Ionicons name="camera" size={12} color="#FFF" />
               </View>
            </TouchableOpacity>
            <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
            
            <View style={[styles.tierBadge, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
               <Ionicons name="diamond" size={14} color={colors.primary} />
               <Text style={[styles.tierText, { color: colors.primary }]}>DIAMOND MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
           <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{orderCount}</Text>
              <Text style={styles.statLabel}>Orders</Text>
           </View>
           <View style={[styles.divider, { backgroundColor: colors.border }]} />
           <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{wishlist.length}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
           </View>
           <View style={[styles.divider, { backgroundColor: colors.border }]} />
           <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{loyaltyPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
           </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, sIndex) => (
          <View key={sIndex} style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, iIndex) => (
                <TouchableOpacity 
                  key={iIndex} 
                  style={[styles.menuItem, iIndex === section.items.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: colors.background }]}
                  onPress={() => item.route && navigation.navigate(item.route as any)}
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.iconBg, { backgroundColor: colors.background }]}>
                       <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
                    </View>
                    <Text style={[styles.menuText, { color: colors.text }]}>{item.title}</Text>
                  </View>
                  <View style={styles.menuRight}>
                    {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                  </View>
                </TouchableOpacity>
              ))}
              {/* Extra Preference: Dark Mode Toggle */}
              {section.title === "PREFERENCES" && (
                <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                   <View style={styles.menuLeft}>
                      <View style={[styles.iconBg, { backgroundColor: colors.background }]}>
                         <Ionicons name={theme === 'dark' ? "moon" : "sunny"} size={20} color={colors.textSecondary} />
                      </View>
                      <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
                   </View>
                   <Switch 
                     value={theme === 'dark'} 
                     onValueChange={toggleTheme}
                     trackColor={{ false: "#DDD", true: colors.primary }}
                     thumbColor={theme === 'dark' ? colors.card : "#FFF"}
                   />
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme === 'dark' ? '#2A1A1A' : '#FFF1F1', borderColor: theme === 'dark' ? '#4A2A2A' : '#FFDADA' }]} onPress={handleLogout}>
           <Text style={[styles.logoutText, { color: colors.error }]}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.2.0 (Build 44)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  topSection: {
    backgroundColor: "#FFF",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
    color: "#1A1A1A",
  },
  settingsIcon: {
    position: 'absolute',
    right: 20,
  },
  userMainInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#F8F9FA",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#D4AF37",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: "#1A1A1A",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#666",
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFE5A3",
  },
  tierText: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    color: "#D4AF37",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: "#1A1A1A",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "#888",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#EEE",
    alignSelf: "center",
  },
  menuSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: "#888",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FA",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: "#1A1A1A",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#888",
    marginRight: 8,
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: "#FFF1F1",
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFDADA",
  },
  logoutText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: "#D32F2F",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#BBB",
    marginTop: 20,
    fontFamily: Fonts.regular,
  },
});
