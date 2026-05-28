import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/type";
import ProductCard from "../components/ProductCard";
import HomeBanner from "../components/HomeBanner";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStoreData } from "../store/slices/storeSlice";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";

const { width } = Dimensions.get("window");

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MainTabs"
>;



import Skeleton from "../components/Skeleton";

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const { products, categories, loading } = useAppSelector((state) => state.store);
  const cart = useAppSelector((state) => state.cart.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const { colors } = useTheme();

  useEffect(() => {
    dispatch(fetchStoreData());
  }, [dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} backgroundColor="#FAFAFA" />
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.logoText}>SWARNIKA</Text>
          </View>
          <View style={styles.cartButton}>
            <Icon name="bag-handle-outline" size={24} color="#1A1A1A" />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Search Skeleton */}
          <View style={[styles.searchContainer, { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }]}>
             <Skeleton width="100%" height={45} borderRadius={16} />
          </View>

          {/* Banner Skeleton */}
          <View style={[styles.heroWrapper, { elevation: 0, shadowOpacity: 0 }]}>
             <Skeleton width="100%" height={160} borderRadius={20} />
          </View>

          {/* Categories Skeleton */}
          <View style={styles.sectionHeader}>
            <Skeleton width={150} height={24} borderRadius={4} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={{ paddingRight: 20 }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.catItem}>
                <Skeleton width={80} height={80} borderRadius={40} style={{ marginBottom: 10 }} />
                <Skeleton width={60} height={14} borderRadius={4} />
              </View>
            ))}
          </ScrollView>

          {/* Special Offers Skeleton */}
          <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
            <Skeleton width="100%" height={120} borderRadius={20} />
          </View>

          {/* Product Grid Skeleton */}
          <View style={styles.sectionHeader}>
            <Skeleton width={140} height={24} borderRadius={4} />
          </View>
          <View style={styles.productGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ width: "48%", marginBottom: 20 }}>
                <Skeleton width="100%" height={180} borderRadius={12} style={{ marginBottom: 10 }} />
                <Skeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
                <Skeleton width="40%" height={18} borderRadius={4} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.logoText, { color: colors.text }]}>SWARNIKA</Text>
        </View>
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="bag-handle-outline" size={24} color={colors.text} />
          {totalItems > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {totalItems > 99 ? "99+" : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Search Bar */}
        <Pressable
          style={[styles.searchContainer, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate("Search")}
        >
          <Icon name="search-outline" size={22} color={colors.textSecondary} />
          <TextInput
            placeholder="Search for elegant jewelry..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            editable={false}
            pointerEvents="none"
          />
          <View style={[styles.filterBtn, { backgroundColor: colors.text }]}>
            <Icon name="options-outline" size={20} color={colors.card} />
          </View>
        </Pressable>

        {/* Hero Banner */}
        <View style={[styles.heroWrapper, { backgroundColor: colors.card }]}>
          <HomeBanner />
        </View>

        {/* Live Gold Rates Widget */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MetalRates")}
          style={[styles.ratesContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.ratesHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.ratesIndicator}>
              <View style={[styles.pulseDot, { backgroundColor: "#2E7D32" }]} />
              <Text style={[styles.ratesLiveText, { color: colors.textSecondary }]}>LIVE METAL RATES TODAY</Text>
            </View>
            <Text style={[styles.ratesTime, { color: colors.textSecondary }]}>Per Gram (INR)</Text>
          </View>
          <View style={styles.ratesRow}>
            <View style={styles.rateBlock}>
              <Text style={[styles.rateTitle, { color: colors.textSecondary }]}>Gold 24K</Text>
              <View style={styles.priceTrendRow}>
                <Text style={[styles.ratePrice, { color: colors.text }]}>₹7,250</Text>
                <View style={styles.trendBadge}>
                  <Icon name="trending-up" size={12} color="#2E7D32" />
                  <Text style={styles.trendText}>+0.4%</Text>
                </View>
              </View>
            </View>
            <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
            <View style={styles.rateBlock}>
              <Text style={[styles.rateTitle, { color: colors.textSecondary }]}>Gold 22K</Text>
              <View style={styles.priceTrendRow}>
                <Text style={[styles.ratePrice, { color: colors.text }]}>₹6,645</Text>
                <View style={styles.trendBadge}>
                  <Icon name="trending-up" size={12} color="#2E7D32" />
                  <Text style={styles.trendText}>+0.3%</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shop by Category</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catItem}
              onPress={() =>
                navigation.navigate("CategoryDetail", {
                  categoryName: cat.name,
                })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.catImgContainer, { backgroundColor: colors.card }]}>
                <Image source={{ uri: cat.img }} style={styles.catImg} />
              </View>
              <Text style={[styles.catText, { color: colors.textSecondary }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Special Offers Section */}
        <View style={styles.offersContainer}>
           <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>Special Promo</Text>
              <Text style={styles.offerDesc}>Get 15% off on your first gold purchase.</Text>
              <TouchableOpacity style={styles.offerBtn} onPress={() => {}}>
                  <Text style={styles.offerBtnText}>Claim Voucher</Text>
              </TouchableOpacity>
           </View>
           <Image 
              source={{ uri: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=300&q=80" }} 
              style={styles.offerImage} 
           />
        </View>

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Curated For You</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs", { screen: "Shop" })}>
            <Text style={styles.seeAll}>Explore</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productGrid}>
          {products.slice(0, 6).map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id || ""}
              name={prod.name}
              price={prod.price.toString()}
              image={prod.image || ""}
              onPress={() => navigation.navigate("ProductDetail", { product: prod } as any)}
            />
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 10,
    color: "#666",
    fontFamily: Fonts.medium,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 2,
  },
  logoText: {
    fontSize: 22,
    color: "#1A1A1A",
    letterSpacing: 3,
    fontFamily: Fonts.bold,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(197, 168, 80, 0.2)",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#C5A850",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FCFBFA",
  },
  badgeText: {
    color: "#0C0C0C",
    fontSize: 9,
    fontFamily: Fonts.bold,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  searchInput: { 
    marginLeft: 10, 
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  filterBtn: {
    backgroundColor: "#C5A850",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  heroWrapper: {
    marginHorizontal: 20,
    marginBottom: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(197, 168, 80, 0.15)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  sectionTitle: { 
    fontSize: 18, 
    color: "#1A1A1A",
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  seeAll: { 
    color: "#C5A850", 
    fontSize: 13,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  catScroll: { 
    paddingLeft: 20,
    marginBottom: 28,
  },
  catItem: { 
    alignItems: "center", 
    marginRight: 20,
  },
  catImgContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
    borderWidth: 1.5,
    borderColor: "rgba(197, 168, 80, 0.25)",
    marginBottom: 8,
  },
  catImg: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 35, 
  },
  catText: { 
    fontSize: 12, 
    fontWeight: "500",
    fontFamily: Fonts.medium,
    letterSpacing: 0.5,
  },
  offersContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: "#121212",
    borderRadius: 24,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(197, 168, 80, 0.3)",
  },
  offerCard: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  offerTitle: {
    color: "#C5A850",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  offerDesc: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: Fonts.medium,
    lineHeight: 22,
    marginBottom: 16,
  },
  offerBtn: {
    backgroundColor: "#C5A850",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  offerBtnText: {
    color: "#0C0C0C",
    fontSize: 11,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  offerImage: {
    width: 110,
    height: "100%",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  ratesContainer: {
    marginHorizontal: 20,
    marginBottom: 28,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  ratesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  ratesIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ratesLiveText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
  ratesTime: {
    fontSize: 10,
    fontFamily: Fonts.medium,
  },
  ratesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rateBlock: {
    flex: 1,
  },
  rateTitle: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  priceTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratePrice: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(46, 125, 50, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 9,
    fontFamily: Fonts.bold,
    color: "#2E7D32",
  },
  verticalDivider: {
    width: 1.5,
    height: "100%",
    marginHorizontal: 16,
  },
});
