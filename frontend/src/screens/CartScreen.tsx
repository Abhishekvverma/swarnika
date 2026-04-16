import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import { CartContext } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

const VALID_COUPONS: Record<string, { type: 'percent' | 'fixed', value: number }> = {
  SAVE10: { type: 'percent', value: 10 },
  SAVE20: { type: 'percent', value: 20 },
  MINUS50: { type: 'fixed', value: 50 },
};

export default function CartScreen({ navigation }: Props) {
  const { cart, removeFromCart, updateQuantity, totalItems } = useContext(CartContext);
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState<{ code: string, type: string, value: number } | null>(null);

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
    updateQuantity(id, qty + 1);
  };

  const handleDecrease = (id: string, qty: number) => {
    if (qty > 1) {
      updateQuantity(id, qty - 1);
    } else {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Remove", onPress: () => removeFromCart(id), style: "destructive" },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleDecrease(item.id, item.quantity)}
          >
            <Ionicons name="remove" size={16} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => handleIncrease(item.id, item.quantity)}
          >
            <Ionicons name="add" size={16} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart ({totalItems})</Text>
        <View style={{ width: 24 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
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
                <View style={styles.promoContainer}>
                    <Text style={styles.promoTitle}>Have a promo code?</Text>
                    <View style={styles.promoRow}>
                        <TextInput 
                            style={styles.promoInput} 
                            placeholder="Enter Code (e.g. SAVE10)"
                            value={promoCode}
                            onChangeText={setPromoCode}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity style={styles.applyBtn} onPress={applyPromoCode}>
                            <Text style={styles.applyBtnText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                    {discount && (
                        <View style={styles.activePromo}>
                            <Text style={styles.activePromoText}>
                                Coupon <Text style={{fontWeight: 'bold'}}>{discount.code}</Text> applied
                            </Text>
                            <TouchableOpacity onPress={removeCoupon}>
                                <Ionicons name="close-circle" size={20} color="#ff3b30" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            }
          />

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Subtotal:</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Discount:</Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-₹{discountAmount.toFixed(2)}</Text>
                </View>
            )}
            <View style={[styles.summaryRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 }]}>
              <Text style={[styles.summaryText, { fontWeight: 'bold', color: '#000' }]}>Total:</Text>
              <Text style={[styles.summaryValue, { fontSize: 18, color: '#D4AF37' }]}>₹{finalTotal.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
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
    backgroundColor: "#FAFAFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D4AF37",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 10,
  },
  promoContainer: {
      marginTop: 10,
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      marginBottom: 20,
  },
  promoTitle: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
  },
  promoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
  },
  promoInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
  },
  applyBtn: {
      backgroundColor: "#1A1A1A",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 8,
  },
  applyBtnText: {
      color: "#fff",
      fontWeight: "bold",
  },
  activePromo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      padding: 10,
      backgroundColor: "#e8f5e9",
      borderRadius: 8,
  },
  activePromoText: {
      color: "#2e7d32",
      fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: {
    color: "#666",
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: "600",
    fontSize: 14,
  },
  checkoutButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
