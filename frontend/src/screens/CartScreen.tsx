import React, { useContext, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  StatusBar,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

const VALID_COUPONS: Record<string, { type: 'percent' | 'fixed', value: number }> = {
  SAVE10: { type: 'percent', value: 10 },
  SAVE20: { type: 'percent', value: 20 },
  MINUS50: { type: 'fixed', value: 50 },
};

interface SwipeableCartItemProps {
  item: any;
  onDecrease: () => void;
  onIncrease: () => void;
  onDelete: () => void;
  colors: any;
}

const SwipeableCartItem: React.FC<SwipeableCartItemProps> = ({
  item,
  onDecrease,
  onIncrease,
  onDelete,
  colors,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -120) {
          Animated.timing(translateX, {
            toValue: -width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={[styles.deleteBackground, { backgroundColor: "#E74C3C" }]}>
        <Ionicons name="trash-outline" size={22} color="#FFF" style={styles.trashIcon} />
      </View>
      <Animated.View
        style={[
          styles.cartItem,
          {
            transform: [{ translateX }],
            backgroundColor: colors.card,
            borderColor: colors.border,
            marginBottom: 0,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price.toLocaleString()}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.qtyButton, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={onDecrease}
            >
              <Ionicons name="remove" size={14} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyButton, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={onIncrease}
            >
              <Ionicons name="add" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default function CartScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { colors, theme } = useTheme();
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState<{ code: string, type: string, value: number } | null>(null);
  const [isPromoFocused, setIsPromoFocused] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (discount) {
      if (discount.type === 'percent') {
          discountAmount = subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed') {
          discountAmount = discount.value;
      }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const applyPromoCode = () => {
      const code = promoCode.trim().toUpperCase();
      if (!code) return;
      
      if (VALID_COUPONS[code]) {
          setDiscount({ code, ...VALID_COUPONS[code] });
          Alert.alert("Success", `Coupon ${code} applied successfully!`);
      } else {
          Alert.alert("Invalid", "This promo code is invalid or expired.");
          setDiscount(null);
      }
  };

  const removeCoupon = () => {
      setDiscount(null);
      setPromoCode("");
  };

  const handleIncrease = (id: string, qty: number) => {
    dispatch(updateQuantity({ id, quantity: qty + 1 }));
  };

  const handleDecrease = (id: string, qty: number) => {
    if (qty > 1) {
      dispatch(updateQuantity({ id, quantity: qty - 1 }));
    } else {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", onPress: () => dispatch(removeFromCart(id)), style: "destructive" },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <SwipeableCartItem
      item={item}
      colors={colors}
      onDecrease={() => handleDecrease(item.id, item.quantity)}
      onIncrease={() => handleIncrease(item.id, item.quantity)}
      onDelete={() => dispatch(removeFromCart(item.id))}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Bag ({totalItems})</Text>
        <View style={{ width: 24 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-handle-outline" size={70} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your shopping bag is empty</Text>
          <TouchableOpacity
            style={[styles.shopButton, { backgroundColor: colors.text }]}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={[styles.shopButtonText, { color: colors.background }]}>START SHOPPING</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
                <View style={[styles.promoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.promoTitle, { color: colors.text }]}>PROMOTIONAL CODE</Text>
                    <View style={styles.promoRow}>
                        <TextInput 
                            style={[
                              styles.promoInput, 
                              { 
                                color: colors.text,
                                borderColor: isPromoFocused ? colors.primary : colors.border,
                                backgroundColor: colors.background,
                              }
                            ]} 
                            placeholder="Enter Code (e.g. SAVE10)"
                            placeholderTextColor={colors.textSecondary}
                            value={promoCode}
                            onChangeText={setPromoCode}
                            autoCapitalize="characters"
                            onFocus={() => setIsPromoFocused(true)}
                            onBlur={() => setIsPromoFocused(false)}
                        />
                        <TouchableOpacity style={[styles.applyBtn, { backgroundColor: colors.text }]} onPress={applyPromoCode}>
                            <Text style={[styles.applyBtnText, { color: colors.background }]}>APPLY</Text>
                        </TouchableOpacity>
                    </View>
                    {discount && (
                        <View style={[styles.activePromo, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder }]}>
                            <Text style={[styles.activePromoText, { color: colors.primary }]}>
                                Coupon <Text style={{fontWeight: 'bold'}}>{discount.code}</Text> applied successfully
                            </Text>
                            <TouchableOpacity onPress={removeCoupon}>
                                <Ionicons name="close-circle" size={18} color="#E74C3C" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            }
          />

          <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>₹{subtotal.toLocaleString()}</Text>
            </View>
            {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Coupon Discount</Text>
                  <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>-₹{discountAmount.toLocaleString()}</Text>
                </View>
            )}
            <View style={[styles.summaryRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }]}>
              <Text style={[styles.summaryText, { fontFamily: Fonts.bold, color: colors.text }]}>Grand Total</Text>
              <Text style={[styles.summaryValue, { fontSize: 16, fontFamily: Fonts.bold, color: colors.primary }]}>₹{finalTotal.toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.text }]}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={[styles.checkoutText, { color: colors.background }]}>PROCEED TO SECURE CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: "transparent",
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    borderWidth: 1,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  promoContainer: {
      marginTop: 10,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  promoTitle: {
      fontSize: 11,
      fontFamily: Fonts.bold,
      letterSpacing: 1.5,
      marginBottom: 12,
  },
  promoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
  },
  promoInput: {
      flex: 1,
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 13,
      fontFamily: Fonts.regular,
  },
  applyBtn: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
  },
  applyBtnText: {
      fontFamily: Fonts.bold,
      fontSize: 12,
      letterSpacing: 1,
  },
  activePromo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
  },
  activePromoText: {
      fontSize: 12,
      fontFamily: Fonts.medium,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  summaryValue: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  checkoutText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    marginTop: 18,
    marginBottom: 26,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    letterSpacing: 1,
  },
  swipeContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 24,
    borderRadius: 20,
  },
  trashIcon: {
    marginRight: 10,
  },
});
