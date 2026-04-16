// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Alert,
//   StatusBar,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Feather from "react-native-vector-icons/Feather";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { Fonts } from "../constants/fonts";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/config";

// const SigninScreen = () => {
//   const navigation = useNavigation<any>();

//   const [isVisible, setIsVisible] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//  const handleSignin = async () => {
//   if (!email || !password) {
//     Alert.alert("Error", "Please fill all fields");
//     return;
//   }

//   try {
//     await signInWithEmailAndPassword(auth, email, password);

//     Alert.alert("Success", "Login successful");

   
    

//   } catch (error: any) {
//     Alert.alert("Login Error", error.message);
//   }
// };


//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <StatusBar barStyle={"dark-content"} />

//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>
//         Sign in to continue managing your business.
//       </Text>

//       {/* Email */}
//       <View style={styles.inputBox}>
//         <MaterialIcons name="email" size={20} color="#00000061" />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       {/* Password */}
//       <View style={styles.inputBox}>
//         <MaterialIcons name="lock" size={20} color="#00000061" />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry={!isVisible}
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
//           <Feather
//             name={isVisible ? "eye" : "eye-off"}
//             size={20}
//             color="#00000061"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Sign In Button */}
//       <TouchableOpacity style={styles.button} onPress={handleSignin}>
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>

//       <Text style={styles.footer}>
//         Don’t have an account?{" "}
//         <Text
//           style={styles.link}
//           onPress={() => navigation.navigate("Signup")}
//         >
//           Sign Up
//         </Text>
//       </Text>
//     </KeyboardAvoidingView>
//   );
// };

// export default SigninScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 60,
//     paddingBottom: 60,
//     paddingHorizontal: 20,
//     backgroundColor: "#ffffff",
//   },

//   title: {
//     fontSize: 26,
//     fontFamily: Fonts.bold,
//     marginTop: 45,
//   },

//   subtitle: {
//     fontSize: 14,
//     color: "#000000a3",
//     lineHeight: 20,
//     marginTop: -4,
//     marginBottom: 40,
//     fontFamily: Fonts.regular,
//   },

//   inputBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     height: 50,
//     borderColor: "#00000061",
//   },

//   input: {
//     flex: 1,
//     marginLeft: 10,
//    top:2,
//     fontFamily: Fonts.regular,
//   },

//   button: {
//     height: 50,
//     backgroundColor: "#B8860B", 
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 70,
//     marginBottom: 30,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontFamily: Fonts.medium,
//   },

//   footer: {
//     fontSize: 13,
//     color: "#000000a3",
//     textAlign: "center",
//     fontFamily: Fonts.regular,
//   },

//   link: {
//     color: "#B8860B",
//     fontFamily: Fonts.medium,
//   },
// });



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
import { loginUser, loginWithGoogle } from "../firebase/auth"; // adjust path if needed

const SigninScreen = () => {
  const navigation = useNavigation<any>();

  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      case "auth/operation-not-supported-in-this-environment":
        return "Google Sign-In is only natively supported on the Web via this method. Native Expo requires a Development Build and further Google Cloud setup.";
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar barStyle={"dark-content"} />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to continue managing your business.
      </Text>

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

      {/* Sign In Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSignin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
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
        onPress={handleGoogleSignin}
        disabled={loading}
      >
          <MaterialIcons name="g-translate" size={20} color="#EA4335" />
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Don’t have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign Up
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default SigninScreen;

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
