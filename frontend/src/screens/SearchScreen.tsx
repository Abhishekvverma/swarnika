


import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItem,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../context/StoreContext";
import { ActivityIndicator } from "react-native";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

const STORAGE_KEY = "RECENT_SEARCHES";



const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const { products, loading } = React.useContext(StoreContext);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  };

  const saveRecentSearches = async (data: string[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const updated = [
      query,
      ...recentSearches.filter((item) => item !== query),
    ];

    setRecentSearches(updated);
    await saveRecentSearches(updated);
  };

  const removeSearch = async (item: string) => {
    const updated = recentSearches.filter((q) => q !== item);
    setRecentSearches(updated);
    await saveRecentSearches(updated);
  };

  const clearAll = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const renderProduct: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProductDetail" as any, { product: item } as any)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#D4AF37"/>
        </View>
      ) : (
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
<TouchableOpacity onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back" size={22} color="#333" />
</TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#999" />
            <TextInput
              placeholder="Search gold, diamond..."
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 🔥 When search is empty */}
        {query.length === 0 && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearAll}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                {recentSearches.map((item, index) => (
                  <View key={index} style={styles.recentItem}>
                    <TouchableOpacity
                      style={styles.recentLeft}
                      onPress={() => setQuery(item)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color="#888"
                      />
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeSearch(item)}>
                      <Ionicons name="close" size={18} color="#999" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* Suggested */}
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
              Suggested for you
            </Text>

            <FlatList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id || ""}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ marginTop: 15 }}
            />
          </>
        )}

        {/* 🔎 Results */}
        {query.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
              Results for{" "}
              <Text style={styles.highlightText}>"{query}"</Text>
            </Text>

            <FlatList
              data={filteredProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id || ""}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ marginTop: 15 }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No results found for "{query}"
                </Text>
              }
            />
          </>
        )}
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    flex: 1,
    height: 40,
  },
  input: {
    marginLeft: 6,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  clearText: {
    fontSize: 13,
    color: "#C89B3C",
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  highlightText: {
    color: "#C89B3C",
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
  card: {
    width: "48%",
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  productTitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
  price: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },
});