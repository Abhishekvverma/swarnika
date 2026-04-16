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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Fonts } from "../constants/fonts";
import { registerUser, loginWithGoogle } from "../firebase/auth";
import { createUserProfile } from "../firebase/firestore";

const SignupScreen = () => {
  const navigation = useNavigation<any>();

  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getFriendlyError = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/operation-not-supported-in-this-environment":
        return "Google Sign-In is only natively supported on the Web via this method. Native Expo requires a Development Build and further Google Cloud setup.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const user = await registerUser(email.trim().toLowerCase(), password);

      await createUserProfile(user.uid, {
        username: username,
        email: email.trim().toLowerCase(),
      });

      // Replace the entire auth stack with Home so Back never returns to Signup.
      navigation.replace("MainTabs");

    } catch (error: any) {
      Alert.alert("Signup Error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle();
      await createUserProfile(user.uid, {
        username: user.displayName || "Google User",
        email: user.email || "",
      });
      navigation.replace("MainTabs");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Google Auth Error", getFriendlyError(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar barStyle={"dark-content"} />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join Retail Pro to manage your business efficiently.
      </Text>

      {/* Username */}
      <View style={styles.inputBox}>
        <MaterialIcons name="person" size={20} color="#00000061" />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Email */}
      <View style={styles.inputBox}>
        <MaterialIcons name="email" size={20} color="#00000061" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputBox}>
        <MaterialIcons name="lock" size={20} color="#00000061" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!isVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Feather
            name={isVisible ? "eye" : "eye-off"}
            size={20}
            color="#00000061"
          />
        </TouchableOpacity>
      </View>

      {/* Signup Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* Google Sign In Placeholder */}
      <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity 
        style={[styles.googleButton, loading && { opacity: 0.7 }]}
        onPress={handleGoogleSignup}
        disabled={loading}
      >
          <MaterialIcons name="g-translate" size={20} color="#EA4335" />
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Signin")}
        >
          Sign In
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    marginTop: 45,
  },

  subtitle: {
    fontSize: 14,
    color: "#000000a3",
    lineHeight: 20,
    marginTop: -4,
    marginBottom: 40,
    fontFamily: Fonts.regular,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
    borderColor: "#00000061",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    top: 2,
    fontFamily: Fonts.regular,
  },

  button: {
    height: 50,
    backgroundColor: "#B8860B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.medium,
  },

  footer: {
    fontSize: 13,
    color: "#000000a3",
    textAlign: "center",
    fontFamily: Fonts.regular,
  },

  link: {
    color: "#B8860B",
    fontFamily: Fonts.medium,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: "#fff",
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: "#333",
  },
});
