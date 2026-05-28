import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/slices/cartSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

export default function CheckoutScreen({ navigation }: Props) {
  const { colors, theme } = useTheme();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Focus states for input highlight rings
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 150 : 0; // Updated shipping to match standard INR context
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!name.trim() || !address.trim() || !city.trim()) {
      Alert.alert("Missing Details", "Please fill in all shipping fields.");
      return;
    }

    if (!user) {
      Alert.alert("Authentication Required", "Please log in to place an order.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order object
      const orderRef = collection(db, "orders");
      await addDoc(orderRef, {
        userId: user.uid,
        items: cart,
        shippingDetails: {
          name: name.trim(),
          address: address.trim(),
          city: city.trim(),
        },
        subtotal,
        shippingFee,
        total,
        status: "processing",
        createdAt: serverTimestamp(),
      });

      // Clear the local cart
      await dispatch(clearCart()).unwrap();
      setIsProcessing(false);

      // Navigate home and show success
      navigation.navigate("MainTabs");
      Alert.alert(
        "Order Placed Successfully! 🎉",
        "Your order has been recorded and will be shipped soon."
      );
    } catch (error: any) {
      console.error("Order error", error);
      setIsProcessing(false);
      Alert.alert("Order Failed", "We could not place your order. " + error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>CHECKOUT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Information</Text>
        
        <View style={styles.formGroup}>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: isNameFocused ? colors.primary : colors.border,
                backgroundColor: colors.card,
              }
            ]}
            placeholder="Full Name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: isAddressFocused ? colors.primary : colors.border,
                backgroundColor: colors.card,
              }
            ]}
            placeholder="Shipping Address"
            placeholderTextColor={colors.textSecondary}
            value={address}
            onChangeText={setAddress}
            onFocus={() => setIsAddressFocused(true)}
            onBlur={() => setIsAddressFocused(false)}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: isCityFocused ? colors.primary : colors.border,
                backgroundColor: colors.card,
              }
            ]}
            placeholder="City"
            placeholderTextColor={colors.textSecondary}
            value={city}
            onChangeText={setCity}
            onFocus={() => setIsCityFocused(true)}
            onBlur={() => setIsCityFocused(false)}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
        <View style={[styles.paymentMethod, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          <Ionicons name="cash-outline" size={22} color={colors.primary} />
          <Text style={[styles.paymentText, { color: colors.text }]}>Cash on Delivery</Text>
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
        <View style={[styles.summaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Items ({totalItems}):</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping & Insurance:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {shippingFee > 0 ? `₹${shippingFee}` : "FREE"}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Grand Total:</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Place Order Button */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            { backgroundColor: colors.text },
            (isProcessing || cart.length === 0) && { opacity: 0.6 }
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing || cart.length === 0}
          activeOpacity={0.9}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.placeOrderText, { color: colors.background }]}>
              PLACE ORDER · ₹{total.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 18,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  paymentText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 0.5,
  },
  summaryBox: {
    borderWidth: 1,
    padding: 20,
    borderRadius: 24,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: Fonts.medium,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Fonts.bold,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: Fonts.bold,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  placeOrderButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  placeOrderText: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
});
