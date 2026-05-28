import React, { useState, useContext, useMemo, memo, useRef } from "react";
import Skeleton from "../components/Skeleton";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "../firebase/types";
import FilterModal, { FilterState } from "../components/FilterModal";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlist } from "../store/slices/wishlistSlice";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const INITIAL_FILTERS: FilterState = {
  sortBy: "newest",
  minPrice: "",
  maxPrice: "",
  materials: [],
  genders: [],
};

const ShopProductCard = memo(({ item, index, isRight, onPress }: { item: Product, index: number, isRight: boolean, onPress: () => void }) => {
  const heights = [180, 240, 200, 260];
  const itemHeight = heights[(index + (isRight ? 1 : 0)) % heights.length];
  const priceToDisplay = item.totalPrice || item.price || 0;

  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);
  const wishlisted = wishlist.some((w) => w.id === item.id);
  const { colors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={[styles.imageWrapper, { borderColor: colors.border }]}>
          <Image
            source={{ uri: item.image || "https://fakeimg.pl/400x400?text=No+Image" }}
            style={[styles.image, { height: itemHeight }]}
            // @ts-ignore
            fadeDuration={0} // Improves scrolling performance on android
          />
          <TouchableOpacity
            style={[styles.heartButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => dispatch(toggleWishlist({ id: item.id || "", name: item.name, price: priceToDisplay, image: item.image || "" }))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={16}
              color={wishlisted ? "#E74C3C" : colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>₹{priceToDisplay.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function ShopScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { products, loading } = useAppSelector((state) => state.store);
  const { colors, theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Search logic
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

      // Material logic
      if (activeFilters.materials.length > 0) {
        const nameLower = product.name.toLowerCase();
        const descLower = (product.description || "").toLowerCase();
        const matMatch = activeFilters.materials.some(mat =>
          nameLower.includes(mat.toLowerCase()) || descLower.includes(mat.toLowerCase())
        );
        if (!matMatch) return false;
      }

      // Gender logic
      if (activeFilters.genders.length > 0) {
        if (!product.gender || !activeFilters.genders.includes(product.gender)) {
          // Special case: if product is Unisex, it matches both Men and Women filters
          if (product.gender !== "Unisex") return false;
        }
      }

      // Price range logic
      const price = product.totalPrice || product.price || 0;
      if (activeFilters.minPrice && price < parseFloat(activeFilters.minPrice)) return false;
      if (activeFilters.maxPrice && price > parseFloat(activeFilters.maxPrice)) return false;

      return true;
    });

    // Sorting logic
    result.sort((a, b) => {
      const priceA = a.totalPrice || a.price || 0;
      const priceB = b.totalPrice || b.price || 0;

      if (activeFilters.sortBy === "price_low") return priceA - priceB;
      if (activeFilters.sortBy === "price_high") return priceB - priceA;
      if (activeFilters.sortBy === "newest") {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as any)?.toDate?.()?.getTime() || new Date(a.createdAt as any).getTime();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as any)?.toDate?.()?.getTime() || new Date(b.createdAt as any).getTime();
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, activeFilters]);

  const leftColumn = useMemo(() => filteredProducts.filter((_, i) => i % 2 === 0), [filteredProducts]);
  const rightColumn = useMemo(() => filteredProducts.filter((_, i) => i % 2 !== 0), [filteredProducts]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}> SHOP</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search collections..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color={colors.primary} />
          {(activeFilters.materials.length > 0 || activeFilters.genders.length > 0 || activeFilters.minPrice || activeFilters.maxPrice) && (
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => setActiveFilters(filters)}
        initialFilters={activeFilters}
      />


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
  },
  header: {
    paddingVertical: 18,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    letterSpacing: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  filterIconButton: {
    marginLeft: 10,
    padding: 4,
  },
  dot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
  },
  filterBtnActive: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
    fontFamily: Fonts.medium,
  },
  filterTextActive: {
    color: "#C5A850",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontFamily: Fonts.regular,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
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
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
    borderBottomWidth: 1,
  },
  image: {
    width: "100%",
    backgroundColor: "transparent",
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 16,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
});
