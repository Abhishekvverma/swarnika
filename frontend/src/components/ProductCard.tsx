import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleWishlist } from "../store/slices/wishlistSlice";

const { width } = Dimensions.get("window");

interface ProductCardProps {
  id: string;
  name: string;
  price: string | number;
  image: string;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onPress,
}) => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);
  const wishlisted = wishlist.some((w) => w.id === id);
  const { colors } = useTheme();
  
  const parsedPrice = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.]/g, ""));

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.imageWrapper, { borderColor: colors.border }]}>
        <Image source={{ uri: image }} style={styles.image} />
        
        <TouchableOpacity
          style={[styles.heart, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => dispatch(toggleWishlist({ id, name, price: parsedPrice, image }))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name={wishlisted ? "heart" : "heart-outline"}
            size={18}
            color={wishlisted ? "#E74C3C" : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ₹{parsedPrice.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: (width - 54) / 2,
    marginBottom: 20,
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
    height: 170,
    backgroundColor: "transparent",
    resizeMode: "cover",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    borderRadius: 18,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
});