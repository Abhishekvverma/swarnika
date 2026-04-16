import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Icon name="card" size={24} color="#D4AF37" />
                <Text style={styles.cardType}>Visa ending in 4242</Text>
            </View>
            <Text style={styles.expiry}>Exp 12/28</Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add New Card</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  card: {
      borderWidth: 1,
      borderColor: "#eee",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      backgroundColor: "#fafafa"
  },
  cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 10,
  },
  cardType: { fontWeight: "bold", fontSize: 16 },
  expiry: { color: "#555", marginTop: 4 },
  addBtn: {
      backgroundColor: "#1A1A1A",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
  },
  addBtnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
  }
});
