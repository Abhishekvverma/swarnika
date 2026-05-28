import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>PAYMENT METHODS</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <Icon name="card" size={22} color={colors.primary} />
                <Text style={[styles.cardType, { color: colors.text }]}>Visa ending in 4242</Text>
            </View>
            <Text style={[styles.expiry, { color: colors.textSecondary }]}>Exp 12/28</Text>
        </View>

        <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.text }]} activeOpacity={0.9}>
            <Icon name="add" size={18} color={colors.background} />
            <Text style={[styles.addBtnText, { color: colors.background }]}>ADD NEW CARD</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  content: { padding: 20 },
  card: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 10,
  },
  cardType: { 
    fontSize: 15, 
    fontFamily: Fonts.bold,
  },
  expiry: { 
    fontFamily: Fonts.regular,
    fontSize: 13, 
    marginTop: 4,
  },
  addBtn: {
      padding: 16,
      borderRadius: 30,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
  },
  addBtnText: {
      fontFamily: Fonts.bold,
      fontSize: 13,
      letterSpacing: 1,
  }
});
