import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { WishlistContext } from "../context/WishlistContext";

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
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext);
  const wishlisted = isWishlisted(id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <TouchableOpacity
        style={styles.heart}
        onPress={() => toggleWishlist({ id, name, price, image })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon
          name={wishlisted ? "heart" : "heart-outline"}
          size={20}
          color={wishlisted ? "#E91E63" : "#B8860B"}
        />
      </TouchableOpacity>

      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.price}>₹{price}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    backgroundColor: "#f9f9f9",
    resizeMode: "contain",
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 5,
  },
  name: {
    marginTop: 10,
    fontWeight: "500",
  },
  price: {
    color: "#B8860B",
    fontWeight: "bold",
    marginTop: 4,
  },
});