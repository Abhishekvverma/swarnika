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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/type";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import { StoreContext } from "../context/StoreContext";
import { ActivityIndicator } from "react-native";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "CategoryDetail"
>;

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}



export default function CategoryDetailScreen({
  route,
}: Props) {
  const { categoryName } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { totalItems } = useContext(CartContext);
  const { products, loading } = useContext(StoreContext);

  const [sortOption, setSortOption] =
    useState<"low" | "high" | null>(null);
  const [filterText, setFilterText] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

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
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#D4AF37"/>
        </View>
      ) : (
      <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {categoryName.toUpperCase()}
        </Text>

        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={24} />

          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="bag-outline" size={24} color="#000" />

            {totalItems > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? "99+" : totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <Text style={styles.itemCount}>
          {filteredProducts.length} Items
        </Text>

        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortModal(true)}
          >
            <Ionicons name="swap-vertical" size={16} />
            <Text>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModal(true)}
          >
            <Ionicons name="options-outline" size={16} />
            <Text>Filter</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>

            <TouchableOpacity
              onPress={() => {
                setSortOption("low");
                setSortModal(false);
              }}
            >
              <Text style={styles.modalOption}>
                Price: Low → High
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSortOption("high");
                setSortModal(false);
              }}
            >
              <Text style={styles.modalOption}>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter</Text>

            <TextInput
              placeholder="Search by name"
              value={filterText}
              onChangeText={setFilterText}
              style={styles.input}
            />

            <TextInput
              placeholder="Max price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={{ marginTop: 10, marginBottom: 8, fontWeight: "500" }}>Gender</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              {["All", "Men", "Women", "Unisex"].map(opt => (
                <TouchableOpacity 
                   key={opt}
                   style={[styles.genderPill, genderFilter === opt && styles.genderPillActive]}
                   onPress={() => setGenderFilter(opt)}
                >
                  <Text style={{ color: genderFilter === opt ? "#fff" : "#333", fontSize: 13 }}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setFilterModal(false)}
              style={styles.applyButton}
            >
              <Text style={{ color: "#fff" }}>Apply</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },

  headerIcons: { flexDirection: "row", gap: 20 },

  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#E91E63",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemCount: { color: "#888" },

  filterOptions: { flexDirection: "row" },

  filterButton: {
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  modalOption: {
    paddingVertical: 12,
    fontSize: 16,
  },

  applyButton: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  genderPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  
  genderPillActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
});