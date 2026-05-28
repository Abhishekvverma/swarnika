import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { auth } from "../firebase/config";
import { getUserProfile, updateUserProfile } from "../firebase/firestore";

export default function PersonalDetailsScreen() {
  const navigation = useNavigation();
  const { colors, theme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email || "");
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUsername(profile.username || "");
            if (profile.phoneNumber) {
              setPhone(profile.phoneNumber);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be signed in to perform this action.");
      return;
    }
    if (!username.trim()) {
      Alert.alert("Error", "Full Name cannot be empty.");
      return;
    }
    
    try {
      setSaving(true);
      await updateUserProfile(user.uid, {
        username: username.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
      });
      Alert.alert("Success", "Personal details updated successfully.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>PERSONAL DETAILS</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput 
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
              placeholder="Eleanor Sterling" 
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
            <TextInput 
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, opacity: 0.7 }]} 
              placeholder="eleanor.sterling@example.com" 
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
            <TextInput 
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
              placeholder="+1 234 567 890" 
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: colors.text }, saving && { opacity: 0.7 }]} 
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
          >
            <Text style={[styles.saveBtnText, { color: colors.background }]}>
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 11, 
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8, 
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  saveBtn: {
      padding: 16,
      borderRadius: 30,
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
  },
  saveBtnText: {
      fontFamily: Fonts.bold,
      fontSize: 13,
      letterSpacing: 1.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
