import React, { useContext } from "react";
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
import { AppStackParamList } from "../navigation/type";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import HomeBanner from "../components/HomeBanner";
import { StoreContext } from "../context/StoreContext";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");
type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "MainTabs"
>;



import Skeleton from "../components/Skeleton";

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { totalItems } = useContext(CartContext);
  const { products, categories, loading } = useContext(StoreContext);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"} backgroundColor="#FAFAFA" />
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.logoText}>LUXE GEMS</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor="#FAFAFA" />

      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.logoText}>LUXE GEMS</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Icon name="bag-handle-outline" size={24} color="#1A1A1A" />
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
          style={styles.searchContainer}
          onPress={() => navigation.navigate("Search")}
        >
          <Icon name="search-outline" size={22} color="#888" />
          <TextInput
            placeholder="Search for elegant jewelry..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            editable={false}
            pointerEvents="none"
          />
          <View style={styles.filterBtn}>
            <Icon name="options-outline" size={20} color="#FFF" />
          </View>
        </Pressable>

        {/* Hero Banner */}
        <View style={styles.heroWrapper}>
          <HomeBanner />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
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
              <View style={styles.catImgContainer}>
                <Image source={{ uri: cat.img }} style={styles.catImg} />
              </View>
              <Text style={styles.catText}>{cat.name}</Text>
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
          <Text style={styles.sectionTitle}>Curated For You</Text>
          <Text style={styles.seeAll}>Explore</Text>
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
    backgroundColor: "#FAFAFA" 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: "center",
  },
  greetingText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins_400Regular",
    marginBottom: 2,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 1.5,
    fontFamily: "Poppins_700Bold",
  },
  cartButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#D4AF37",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  searchInput: { 
    marginLeft: 12, 
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  filterBtn: {
    backgroundColor: "#1A1A1A",
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  heroWrapper: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: "#FFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: "baseline",
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins_600SemiBold",
  },
  seeAll: { 
    color: "#D4AF37", 
    fontSize: 14,
    fontWeight: "600",
  },
  catScroll: { 
    paddingLeft: 20,
    marginBottom: 30,
  },
  catItem: { 
    alignItems: "center", 
    marginRight: 20,
  },
  catImgContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  catImg: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 36, 
  },
  catText: { 
    fontSize: 13, 
    color: "#4A4A4A",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  offersContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  offerCard: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  offerTitle: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  offerDesc: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    marginBottom: 15,
  },
  offerBtn: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  offerBtnText: {
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: "bold",
  },
  offerImage: {
    width: 120,
    height: "100%",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
