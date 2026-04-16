import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WishlistContext, WishlistItem } from "../context/WishlistContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/type";

const { width } = Dimensions.get("window");
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, loading } = useContext(WishlistContext);
  const navigation = useNavigation<Nav>();

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          product: {
            id: item.id,
            name: item.name,
            price: typeof item.price === "string" 
              ? parseFloat(item.price.replace(/[^0-9.]/g, "")) 
              : item.price,
            image: item.image,
          },
        })
      }
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => toggleWishlist(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="heart" size={22} color="#E91E63" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        {wishlist.length > 0 && (
          <Text style={styles.count}>{wishlist.length} items</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#B8860B"
          style={{ marginTop: 60 }}
        />
      ) : wishlist.length === 0 ? (
        // ── Empty state ──
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={72} color="#ddd" />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any product to save it here
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate("Categories")}
          >
            <Text style={styles.shopBtnText}>Browse Products</Text>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  count: {
    fontSize: 13,
    color: "#888",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B8860B",
  },
  removeBtn: {
    padding: 8,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  shopBtn: {
    marginTop: 16,
    backgroundColor: "#B8860B",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 30,
  },
  shopBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
