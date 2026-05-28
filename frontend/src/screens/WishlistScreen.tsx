import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/type";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlist, WishlistItem } from "../store/slices/wishlistSlice";

const { width } = Dimensions.get("window");
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const dispatch = useAppDispatch();
  const { wishlist, loading } = useAppSelector((state) => state.wishlist);
  const navigation = useNavigation<Nav>();
  const { colors, theme } = useTheme();

  const renderItem = ({ item }: { item: WishlistItem }) => {
    const priceToDisplay = typeof item.price === "string" 
      ? parseFloat(item.price.replace(/[^0-9.]/g, "")) 
      : item.price;
      
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() =>
          navigation.navigate("ProductDetail", {
            product: {
              id: item.id,
              name: item.name,
              price: priceToDisplay,
              image: item.image,
              category: "", // Wishlist items do not store category; fallback to empty string
            },
          })
        }
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>₹{priceToDisplay.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => dispatch(toggleWishlist(item))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>MY WISHLIST</Text>
        {wishlist.length > 0 && (
          <Text style={[styles.count, { color: colors.textSecondary }]}>{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 60 }}
        />
      ) : wishlist.length === 0 ? (
        // ── Empty state ──
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your wishlist is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Tap the heart on any exquisite piece to save it here for later.
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { backgroundColor: colors.text }]}
            onPress={() => navigation.navigate("MainTabs", { screen: "Shop" })}
          >
            <Text style={[styles.shopBtnText, { color: colors.background }]}>BROWSE PRODUCTS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
  },
  count: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: "transparent",
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  removeBtn: {
    padding: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginTop: 18,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  shopBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  shopBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
