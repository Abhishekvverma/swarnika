import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
          <View style={styles.settingRow}>
              <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDesc}>Receive alerts for your orders</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#D4AF37" }}
                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                onValueChange={() => setIsEnabled(!isEnabled)}
                value={isEnabled}
              />
          </View>
          
          <Text style={styles.sectionHeader}>Recent Notifications</Text>
          <View style={styles.notificationCard}>
              <Icon name="cube" size={24} color="#D4AF37" style={{marginRight: 12}} />
              <View style={{flex: 1}}>
                  <Text style={styles.notifTitle}>Order Delivered</Text>
                  <Text style={styles.notifTime}>Your Solitaire Diamond Ring has been delivered. Enjoy!</Text>
                  <Text style={{color: "#888", fontSize: 12, marginTop: 4}}>2 hours ago</Text>
              </View>
          </View>
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
  settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      marginBottom: 20,
  },
  settingTitle: { fontSize: 16, fontWeight: "500" },
  settingDesc: { fontSize: 13, color: "#666", marginTop: 4 },
  sectionHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 16 },
  notificationCard: {
      flexDirection: "row",
      backgroundColor: "#fafafa",
      padding: 16,
      borderRadius: 12,
      alignItems: "flex-start",
  },
  notifTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  notifTime: { color: "#444", fontSize: 14 }
});
