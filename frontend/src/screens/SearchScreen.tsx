


import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import ProductCard from "../components/ProductCard";
import { useAppSelector } from "../store/hooks";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

const STORAGE_KEY = "RECENT_SEARCHES";



const SearchScreen = () => {
  const { colors, theme } = useTheme();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<any>();
  const { products, loading } = useAppSelector((state) => state.store);

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
    <ProductCard
      id={item.id}
      image={item.image || ""}
      name={item.name}
      price={item.price.toString()}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <View 
            style={[
              styles.searchBar, 
              { 
                backgroundColor: colors.card, 
                borderColor: isFocused ? colors.primary : colors.border 
              }
            ]}
          >
            <Ionicons name="search" size={18} color={isFocused ? colors.primary : colors.textSecondary} />
            <TextInput
              placeholder="Search gold, diamond..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
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
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearAll}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                {recentSearches.map((item, index) => (
                  <View key={index} style={[styles.recentItem, { borderColor: colors.border }]}>
                    <TouchableOpacity
                      style={styles.recentLeft}
                      onPress={() => setQuery(item)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={colors.textSecondary}
                      />
                      <Text style={[styles.recentText, { color: colors.textSecondary }]}>{item}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeSearch(item)}>
                      <Ionicons name="close" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* Suggested */}
            <Text style={[styles.sectionTitle, { marginTop: 32, color: colors.text }]}>
              Suggested For You
            </Text>

            <FlatList
              data={products.slice(0, 4)}
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
            <Text style={[styles.sectionTitle, { marginTop: 32, color: colors.text }]}>
              Results for{" "}
              <Text style={[styles.highlightText, { color: colors.primary }]}>"{query}"</Text>
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
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 14,
    marginLeft: 8,
    flex: 1,
    height: 48,
    borderWidth: 1.5,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  clearText: {
    fontSize: 12,
    color: "#C5A850",
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  highlightText: {
    fontFamily: Fonts.bold,
  },
  emptyText: {
    marginTop: 32,
    textAlign: "center",
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
});