import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>NOTIFICATIONS</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Receive alerts for your orders</Text>
              </View>
              <Switch
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#f4f3f4"
                onValueChange={() => setIsEnabled(!isEnabled)}
                value={isEnabled}
              />
          </View>
          
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Recent Notifications</Text>
          <View style={[styles.notificationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon name="cube" size={22} color={colors.primary} style={{marginRight: 12, marginTop: 2}} />
              <View style={{flex: 1}}>
                  <Text style={[styles.notifTitle, { color: colors.text }]}>Order Delivered</Text>
                  <Text style={[styles.notifText, { color: colors.textSecondary }]}>Your Solitaire Diamond Ring has been delivered. Enjoy!</Text>
                  <Text style={{color: colors.textSecondary, fontSize: 11, fontFamily: Fonts.regular, marginTop: 6}}>2 hours ago</Text>
              </View>
          </View>
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
  settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      marginBottom: 20,
  },
  settingTitle: { 
    fontSize: 15, 
    fontFamily: Fonts.bold,
  },
  settingDesc: { 
    fontSize: 13, 
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  sectionHeader: { 
    fontSize: 14, 
    fontFamily: Fonts.bold, 
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16, 
  },
  notificationCard: {
      flexDirection: "row",
      padding: 16,
      borderRadius: 20,
      alignItems: "flex-start",
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  notifTitle: { 
    fontSize: 14, 
    fontFamily: Fonts.bold,
    marginBottom: 4, 
  },
  notifText: { 
    fontSize: 13,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  }
});
