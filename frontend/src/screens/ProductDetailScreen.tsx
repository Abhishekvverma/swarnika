import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Share,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import ProductCard from "../components/ProductCard";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/slices/cartSlice";
import { toggleWishlist } from "../store/slices/wishlistSlice";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

const { width } = Dimensions.get("window");

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { colors, theme } = useTheme();
  const { products } = useAppSelector((state) => state.store);

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

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

  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);
  const cart = useAppSelector((state) => state.cart.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlisted = wishlist.some((w) => w.id === product.id);

  const productPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));

  const handleShare = async () => {
    try {
      const message = `Check out the gorgeous "${product.name}" on Swarnika! ✨\nPrice: ₹${productPrice.toLocaleString()}\n\nExplore and buy the finest certified jewelry here!`;
      await Share.share({
        message,
        title: product.name,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to share product");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerIcon, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>


        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIcon, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </TouchableOpacity>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Container */}
        <View style={[styles.imageContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {/* Wishlist Pill */}
          <TouchableOpacity
            style={[styles.wishlistPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() =>
              dispatch(
                toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: productPrice,
                  image: product.image,
                })
              )
            }
          >
            <Ionicons
              name={wishlisted ? "heart" : "heart-outline"}
              size={14}
              color={wishlisted ? "#E74C3C" : colors.primary}
            />
            <Text style={[styles.wishlistText, { color: colors.text }]}>WISHLIST</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.content}>
          {/* Title & Price Row */}
          <View style={styles.titlePriceRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {(product as any).purity || '18K'} Gold · Guaranteed BIS Hallmarked
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>₹{productPrice.toLocaleString()}</Text>
              <Text style={[styles.taxText, { color: colors.textSecondary }]}>incl. all taxes</Text>
            </View>
          </View>

          {/* Rating Row */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={[styles.ratingText, { color: colors.text }]}>4.9 (128 Reviews)</Text>
            <View style={[styles.badgePill, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={[styles.badgePillText, { color: colors.textSecondary }]}>BIS Hallmarked</Text>
            </View>
          </View>

          {/* Info Blocks */}
          <View style={styles.infoBlocksRow}>
            <View style={[styles.infoBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>MATERIAL</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{(product as any).purity || '18K'} Gold</Text>
            </View>
            <View style={[styles.infoBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>MAKING</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>₹{((product as any).makingCharges || 0).toLocaleString()}</Text>
            </View>
            <View style={[styles.infoBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>WEIGHT</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{(product as any).weight ? `${(product as any).weight} g` : '4.5 g'}</Text>
            </View>
          </View>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>SELECT SIZE</Text>
                <TouchableOpacity>
                  <Text style={[styles.linkText, { color: colors.primary }]}>Size guide</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizesRow}>
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeCircle,
                      { borderColor: colors.border, backgroundColor: colors.card },
                      selectedSize === size && [styles.sizeCircleSelected, { backgroundColor: colors.primary, borderColor: colors.primary }],
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        { color: colors.text },
                        selectedSize === size && [styles.sizeTextSelected, { color: colors.background }],
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
              <Text style={[styles.sectionTitle, { color: colors.text }]}>THE DESIGN STORY</Text>
            </View>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {(product as any).description || "Inspired by classical royalty, this exquisite masterpiece features a brilliant-cut center stone encircled by a constellation of pavé-set gems, handcrafted in certified fine gold for a luminous, timeless glow."}
            </Text>
          </View>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {["Free Insured Shipping", "30-Day Returns", "Lifetime Polish"].map(
              (tag, index) => (
                <View key={index} style={[styles.tagPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
                </View>
              )
            )}
          </ScrollView>

          {/* Customer Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>GUEST REVIEWS</Text>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: colors.primary }]}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
              {[
                { name: "Ananya S.", rating: 5, comment: "Absolutely stunning! The gold purity and finish are top-notch." },
                { name: "Rahul K.", rating: 4, comment: "Incredibly crafted design, very elegant for formal occasions." },
                { name: "Sanya M.", rating: 5, comment: "Exceeded my expectations. Beautiful packaging and perfectly hallmarked." }
              ].map((review, i) => (
                <View key={i} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>{review.name}</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Ionicons key={s} name="star" size={10} color={s <= review.rating ? colors.primary : colors.border} />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: colors.textSecondary }]} numberOfLines={2}>"{review.comment}"</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>YOU MAY ALSO LIKE</Text>
              </View>
              <View style={styles.relatedGrid}>
                {relatedProducts.map((prod) => (
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
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.text }]}
            onPress={() => {
              dispatch(
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: productPrice,
                  image: product.image,
                  quantity: 1,
                })
              );
              navigation.goBack();
            }}
          >
            <Text style={[styles.addText, { color: colors.background }]}>ADD TO SHOPPING BAG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    letterSpacing: 3,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
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
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    borderBottomWidth: 1,
  },
  mainImage: {
    width: "100%",
    height: width * 1.05,
    resizeMode: "contain",
  },
  wishlistPill: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  wishlistText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    marginLeft: 6,
    letterSpacing: 1,
  },

  content: {
    padding: 16,
    paddingTop: 24,
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
    fontSize: 22,
    fontFamily: Fonts.bold,
    marginBottom: 6,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 22,
    fontFamily: Fonts.bold,
  },
  taxText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    marginLeft: 6,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 12,
  },
  badgePillText: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    marginLeft: 4,
  },
  infoBlocksRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  infoBlock: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 9,
    fontFamily: Fonts.medium,
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  sizeSection: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
  linkText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  sizesRow: {
    flexDirection: "row",
    gap: 12,
  },
  sizeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeCircleSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sizeText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  sizeTextSelected: {},
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    paddingBottom: 8,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  bottomBarInner: {
    flexDirection: "row",
    width: "100%",
  },
  addButton: {
    flex: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  addText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
  reviewsSection: {
    marginTop: 12,
    marginBottom: 10,
  },
  reviewsScroll: {
    paddingRight: 20,
    marginTop: 4,
  },
  reviewCard: {
    width: 250,
    padding: 16,
    borderRadius: 20,
    marginRight: 14,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 18,
    fontStyle: "italic",
  },
  relatedSection: {
    marginTop: 28,
    marginBottom: 10,
  },
  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
});