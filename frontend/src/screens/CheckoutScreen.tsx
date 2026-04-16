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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/type";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

export default function CheckoutScreen({ navigation }: Props) {
  const { cart, clearCart, totalItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!name || !address || !city) {
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
          name,
          address,
          city,
        },
        subtotal,
        shippingFee,
        total,
        status: "processing",
        createdAt: serverTimestamp(),
      });

      // Clear the local cart
      await clearCart();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethod}>
          <Ionicons name="cash-outline" size={24} color="#B8860B" />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
          <Ionicons name="checkmark-circle" size={24} color="#B8860B" />
        </View>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({totalItems}):</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>₹{shippingFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order • ₹{total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 10,
    color: "#333",
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 15,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#B8860B",
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  summaryBox: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 40,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: "#666",
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B8860B",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  placeOrderButton: {
    backgroundColor: "#C49A33",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderButtonDisabled: {
    backgroundColor: "#666",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
