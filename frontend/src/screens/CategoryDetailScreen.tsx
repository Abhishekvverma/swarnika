import React, { useState, useMemo, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/type";
import ProductCard from "../components/ProductCard";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppSelector } from "../store/hooks";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "CategoryDetail"
>;

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function CategoryDetailScreen({
  route,
}: Props) {
  const { categoryName } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const cart = useAppSelector((state) => state.cart.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { products, loading } = useAppSelector((state) => state.store);
  const { colors, theme } = useTheme();

  const [sortOption, setSortOption] =
    useState<"low" | "high" | null>(null);
  const [filterText, setFilterText] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalize = (val: string) => val.toLowerCase().replace(/s$/, '');
    let data = products.filter(p => normalize(p.category) === normalize(categoryName));

    if (filterText.trim()) {
      data = data.filter((item) =>
        item.name
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
    }

    if (maxPrice) {
      data = data.filter(
        (item) => item.price <= Number(maxPrice)
      );
    }

    if (genderFilter !== "All") {
      data = data.filter(
        (item: any) => item.gender?.toLowerCase() === genderFilter.toLowerCase()
      );
    }

    if (sortOption === "low") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [sortOption, filterText, maxPrice, genderFilter, products, categoryName]);

  const renderProduct = ({
    item,
  }: {
    item: any;
  }) => (
    <ProductCard
      id={item.id}
      image={item.image || ""}
      name={item.name}
      price={item.price.toString()}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          product: item,
        })
      }
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color={colors.primary}/>
        </View>
      ) : (
      <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.headerIcon, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {categoryName.toUpperCase()}
        </Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[styles.headerIcon, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="bag-outline" size={20} color={colors.text} />

            {totalItems > 0 && (
              <View style={[styles.badgeContainer, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                <Text style={[styles.badgeText, { color: colors.background }]}>
                  {totalItems > 99 ? "99+" : totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER BAR */}
      <View style={[styles.filterBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "Item" : "Items"}
        </Text>

        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortModal(true)}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.primary} />
            <Text style={[styles.filterBtnText, { color: colors.text }]}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModal(true)}
          >
            <Ionicons name="options-outline" size={16} color={colors.primary} />
            <Text style={[styles.filterBtnText, { color: colors.text }]}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id || item.name}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* SORT MODAL */}
      <Modal visible={sortModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSortModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>SORT BY</Text>

            <TouchableOpacity
              style={[styles.sortOptionRow, sortOption === "low" && { borderLeftColor: colors.primary }]}
              onPress={() => {
                setSortOption("low");
                setSortModal(false);
              }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text }, sortOption === "low" && { color: colors.primary }]}>
                Price: Low → High
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOptionRow, sortOption === "high" && { borderLeftColor: colors.primary }]}
              onPress={() => {
                setSortOption("high");
                setSortModal(false);
              }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text }, sortOption === "high" && { color: colors.primary }]}>
                Price: High → Low
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FILTER MODAL */}
      <Modal visible={filterModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setFilterModal(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>FILTER BY</Text>

            <View style={[styles.inputBox, isSearchFocused && { borderColor: colors.primary }]}>
              <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
              <TextInput
                placeholder="Search by name..."
                placeholderTextColor={colors.textSecondary}
                value={filterText}
                onChangeText={setFilterText}
                style={[styles.input, { color: colors.text }]}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </View>

            <View style={[styles.inputBox, isPriceFocused && { borderColor: colors.primary }]}>
              <Ionicons name="pricetag-outline" size={18} color={colors.textSecondary} />
              <TextInput
                placeholder="Maximum Price"
                placeholderTextColor={colors.textSecondary}
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                style={[styles.input, { color: colors.text }]}
                onFocus={() => setIsPriceFocused(true)}
                onBlur={() => setIsPriceFocused(false)}
              />
            </View>

            <Text style={[styles.filterSectionLabel, { color: colors.text }]}>GENDER</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
              {["All", "Men", "Women", "Unisex"].map(opt => (
                <TouchableOpacity 
                   key={opt}
                   style={[
                     styles.genderPill, 
                     { borderColor: colors.border },
                     genderFilter === opt && [styles.genderPillActive, { backgroundColor: colors.primary, borderColor: colors.primary }]
                   ]}
                   onPress={() => setGenderFilter(opt)}
                >
                  <Text style={[
                    styles.genderPillText, 
                    { color: colors.text },
                    genderFilter === opt && { color: colors.background }
                  ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setFilterModal(false)}
              style={[styles.applyButton, { backgroundColor: colors.text }]}
            >
              <Text style={[styles.applyButtonText, { color: colors.background }]}>APPLY FILTERS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    letterSpacing: 3,
  },

  headerIcons: { flexDirection: "row", gap: 8 },

  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },

  badgeText: {
    fontSize: 8,
    fontFamily: Fonts.bold,
  },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },

  itemCount: { 
    fontSize: 12, 
    fontFamily: Fonts.medium,
  },

  filterOptions: { flexDirection: "row" },

  filterButton: {
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
    gap: 6,
  },
  
  filterBtnText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  modalContent: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  
  modalHeaderIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
    marginBottom: 16,
  },

  sortOptionRow: {
    paddingVertical: 14,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    paddingLeft: 12,
  },
  
  modalOptionText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
  },

  applyButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  
  applyButtonText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    borderColor: "rgba(0,0,0,0.05)",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  
  filterSectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },

  genderPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  
  genderPillActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  genderPillText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
});