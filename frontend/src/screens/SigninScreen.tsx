

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fonts } from "../constants/fonts";
import { loginUser, loginWithGoogle } from "../firebase/auth";
import { useTheme } from "../theme/ThemeContext";

const { height } = Dimensions.get("window");

const SigninScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Focus states for luxurious input rings
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const getFriendlyError = (code: string) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/invalid-credential":
        return "Invalid email or password.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email.trim(), password);
      navigation.replace("MainTabs");
    } catch (error: any) {
      Alert.alert("Login Error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Google Auth Error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior="padding"
    >
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 40 }}
      >
        {/* Brand Logo Header */}
        <View style={styles.brandContainer}>
          <Text style={[styles.brandTitle, { color: colors.text }]}>L U X E  G E M S</Text>
          <Text style={[styles.brandSubtitle, { color: colors.primary }]}>EXQUISITE JEWELLERY</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to discover premium gold, diamond, and bridal collections curated just for you.
        </Text>

        {/* Email Input */}
        <View 
          style={[
            styles.inputBox, 
            { 
              backgroundColor: colors.card,
              borderColor: isEmailFocused ? colors.primary : colors.border,
            }
          ]}
        >
          <MaterialIcons name="email" size={20} color={isEmailFocused ? colors.primary : colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Email Address"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
        </View>

        {/* Password Input */}
        <View 
          style={[
            styles.inputBox, 
            { 
              backgroundColor: colors.card,
              borderColor: isPasswordFocused ? colors.primary : colors.border,
            }
          ]}
        >
          <MaterialIcons name="lock" size={20} color={isPasswordFocused ? colors.primary : colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={!isVisible}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
            <Feather
              name={isVisible ? "eye" : "eye-off"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.text }, 
            loading && { opacity: 0.7 }
          ]}
          onPress={handleSignin}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity 
          style={[
            styles.googleButton, 
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
            loading && { opacity: 0.7 }
          ]}
          onPress={handleGoogleSignin}
          disabled={loading}
        >
          <MaterialIcons name="g-translate" size={20} color="#EA4335" />
          <Text style={[styles.googleButtonText, { color: colors.text }]}>Sign In with Google</Text>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Don’t have an account?{" "}
          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => navigation.navigate("Signup")}
          >
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  brandTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    letterSpacing: 4,
  },

  brandSubtitle: {
    fontSize: 10,
    fontFamily: Fonts.medium,
    letterSpacing: 2,
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 32,
    fontFamily: Fonts.regular,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },

  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },

  footer: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: Fonts.regular,
    marginTop: 10,
  },

  link: {
    fontFamily: Fonts.bold,
  },
  
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
  },
  
  dividerText: {
    marginHorizontal: 16,
    fontSize: 11,
    fontFamily: Fonts.bold,
    letterSpacing: 1,
  },
  
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderWidth: 1.5,
    borderRadius: 28,
    marginBottom: 24,
  },
  
  googleButtonText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
});
