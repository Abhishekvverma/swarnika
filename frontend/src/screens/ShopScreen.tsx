import React, { useState, useContext, useMemo, memo } from "react";
import Skeleton from "../components/Skeleton";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreContext } from "../context/StoreContext";
import { Product } from "../firebase/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ["All", "Gold", "Silver", "Women", "Men"];

const ShopProductCard = memo(({ item, index, isRight, onPress }: { item: Product, index: number, isRight: boolean, onPress: () => void }) => {
  const heights = [180, 240, 200, 260];
  const itemHeight = heights[(index + (isRight ? 1 : 0)) % heights.length];
  const priceToDisplay = item.totalPrice || item.price || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image || "https://fakeimg.pl/400x400?text=No+Image" }}
        style={[styles.image, { height: itemHeight }]}
        // @ts-ignore
        fadeDuration={0} // Improves scrolling performance on android
      />
      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart-outline" size={18} color="#000" />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.price}>₹{priceToDisplay.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { products, loading } = useContext(StoreContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !product.name.toLowerCase().includes(query) &&
          !product.description?.toLowerCase().includes(query) &&
          !product.category.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (activeFilter !== "All") {
        const nameLower = product.name.toLowerCase();
        const descLower = (product.description || "").toLowerCase();
        
        if (activeFilter === "Gold") {
          if (!nameLower.includes("gold") && !product.purity?.includes("K")) return false;
        } else if (activeFilter === "Silver") {
          if (!nameLower.includes("silver") && !descLower.includes("silver")) return false;
        } else if (activeFilter === "Women" || activeFilter === "Men") {
          if (product.gender && product.gender !== "Unisex" && product.gender !== activeFilter) return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, activeFilter]);

  const leftColumn = useMemo(() => filteredProducts.filter((_, i) => i % 2 === 0), [filteredProducts]);
  const rightColumn = useMemo(() => filteredProducts.filter((_, i) => i % 2 !== 0), [filteredProducts]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SHOP</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.masonryContainer}>
            <View style={styles.column}>
              {[180, 240, 200].map((h, i) => (
                <View key={`left-${i}`} style={{ marginBottom: 16 }}>
                   <Skeleton width="100%" height={h} borderRadius={12} style={{ marginBottom: 10 }} />
                   <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
                   <Skeleton width="40%" height={16} borderRadius={4} />
                </View>
              ))}
            </View>
            <View style={styles.column}>
              {[240, 200, 260].map((h, i) => (
                <View key={`right-${i}`} style={{ marginBottom: 16 }}>
                   <Skeleton width="100%" height={h} borderRadius={12} style={{ marginBottom: 10 }} />
                   <Skeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
                   <Skeleton width="40%" height={16} borderRadius={4} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
        >
          <View style={styles.masonryContainer}>
            <View style={styles.column}>
              {leftColumn.map((item, i) => (
                <ShopProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  isRight={false}
                  onPress={() => navigation.navigate("ProductDetail", { product: item as any })}
                />
              ))}
            </View>
            <View style={styles.column}>
              {rightColumn.map((item, i) => (
                <ShopProductCard
                  key={item.id}
                  item={item}
                  index={i}
                  isRight={true}
                  onPress={() => navigation.navigate("ProductDetail", { product: item as any })}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 2,
    color: "#1A1A1A",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  filterBtnActive: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Poppins_500Medium",
  },
  filterTextActive: {
    color: "#D4AF37",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#888",
    fontFamily: "Poppins_400Regular",
  },
  scrollContent: {
    padding: 12,
  },
  masonryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
    flexDirection: "column",
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: "#F0F0F0",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 20,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: "Poppins_500Medium",
  },
  price: {
    fontSize: 14,
    color: "#D4AF37",
    fontFamily: "Poppins_700Bold",
    marginTop: 4,
  },
});
