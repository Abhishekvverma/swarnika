import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function SavedAddressesScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.addressCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Home</Text>
                <TouchableOpacity>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.addressText}>123 Luxury Lane, Suite 400</Text>
            <Text style={styles.addressText}>Beverly Hills, CA 90210</Text>
        </View>

        <TouchableOpacity style={styles.addBtn}>
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add New Address</Text>
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
  addressCard: {
      borderWidth: 1,
      borderColor: "#eee",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
  },
  cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16 },
  editText: { color: "#D4AF37", fontWeight: "600" },
  addressText: { color: "#555", marginTop: 4 },
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
