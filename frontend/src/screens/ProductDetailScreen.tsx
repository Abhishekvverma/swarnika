import React, { useState, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

const { width } = Dimensions.get("window");

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const getSizesForCategory = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'ring':
        return ['5', '6', '7', '8', '9', '10'];
      case 'necklace':
        return ['16"', '18"', '20"', '22"', '24"'];
      case 'bracelet':
        return ['6"', '6.5"', '7"', '7.5"', '8"'];
      default:
        return [];
    }
  };

  const sizes = getSizesForCategory(product.category);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');

  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const { addToCart, totalItems } = useContext(CartContext);
  const wishlisted = isWishlisted(product.id);

  const productPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));

  // 360 Rotation Animation
  const spinValue = React.useRef(new Animated.Value(0)).current;

  const handle360Rotate = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AURUM</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-social-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Container */}
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: product.image }}
            style={[styles.mainImage, { transform: [{ rotateY: spin }] }]}
            resizeMode="contain"
          />
          {/* Wishlist Pill */}
          <TouchableOpacity
            style={styles.wishlistPill}
            onPress={() =>
              toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={16}
              color={wishlisted ? "#d9534f" : "#d9534f"}
            />
            <Text style={styles.wishlistText}>WISHLIST</Text>
          </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        <View style={styles.thumbnailRow}>
          {[1, 2, 3].map((item, index) => (
            <View key={item} style={styles.thumbnailWrapper}>
              <Image
                source={{ uri: product.image }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
              {index === 2 && (
                <View style={styles.zoomOverlay}>
                  <TouchableOpacity style={styles.zoomButton} onPress={handle360Rotate}>
                    <Ionicons name="refresh" size={16} color="#000" />
                    <Text style={styles.zoomText}>360°</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.content}>
          {/* Title & Price Row */}
          <View style={styles.titlePriceRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.subtitle}>
                {(product as any).purity || '18K'} Gold · Hallmarked
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{productPrice.toLocaleString()}</Text>
              <Text style={styles.taxText}>incl. all taxes</Text>
            </View>
          </View>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <Ionicons name="star-outline" size={16} color="#B8860B" />
            <Text style={styles.ratingText}>4.9 · 128 reviews</Text>
            <View style={styles.badgePill}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#000" />
              <Text style={styles.badgePillText}>BIS Hallmarked</Text>
            </View>
          </View>

          {/* Info Blocks */}
          <View style={styles.infoBlocksRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>MATERIAL</Text>
              <Text style={styles.infoValue}>{(product as any).purity || '18K'} Gold</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>MAKING</Text>
              <Text style={styles.infoValue}>₹{(product as any).makingCharges || 0}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>WEIGHT</Text>
              <Text style={styles.infoValue}>{(product as any).weight ? `${(product as any).weight} g` : '--'}</Text>
            </View>
          </View>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Size</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Size guide</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizesRow}>
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeCircle,
                      selectedSize === size && styles.sizeCircleSelected,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextSelected,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Read more</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionText}>
              {(product as any).description || "Inspired by the winter solstice, this halo ring features a brilliant-cut centre diamond encircled by a constellation of pavé-set stones, handcrafted in 18K white gold for a luminous, timeless glow."}
            </Text>
          </View>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {["Free insured shipping", "30-day returns", "Lifetime polish"].map(
              (tag, index) => (
                <View key={index} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Actions Bar */}
    
        <View style={styles.bottomBarInner}>
        
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              addToCart({
                id: product.id,
                name: product.name,
                price: productPrice,
                image: product.image,
                quantity: 1, // Quantity defaults to 1
              });
              navigation.goBack();
            }}
          >
            <Text style={styles.addText}>ADD TO CART</Text>
          </TouchableOpacity>
       
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#000",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E91E63",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: width * 1.1,
    resizeMode: "contain",
  },
  wishlistPill: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5C8C8",
  },
  wishlistText: {
    color: "#d9534f",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  thumbnailRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 12,
  },
  thumbnailWrapper: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    position: "relative",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  zoomOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomText: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#B8860B",
  },
  taxText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 4,
    fontWeight: "500",
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
    color: "#333",
  },
  infoBlocksRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 10,
    color: "#888",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  sizeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  linkText: {
    fontSize: 13,
    color: "#B8860B",
    fontWeight: "500",
  },
  sizesRow: {
    flexDirection: "row",
    gap: 12,
  },
  sizeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sizeCircleSelected: {
    backgroundColor: "#C49A33",
    borderColor: "#C49A33",
  },
  sizeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  sizeTextSelected: {
    color: "#fff",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 8,
  },
  tagPill: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  
  
  },
  bottomBarInner: {
    flexDirection: "row",
    gap: 12,
      width:"90%",
      alignSelf:"center"
  },
  outlineSquareBtn: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#C49A33",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  addText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});