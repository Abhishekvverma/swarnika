import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Fonts } from "../constants/fonts";
import { useAppSelector } from "../store/hooks";

type RootStackParamList = {
  Categories: undefined;
  CategoryDetail: { categoryName: string };
};
const { width } = Dimensions.get("window");

interface Category {
  id: string;
  name: string;
  img: string;
}

const CategoriesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Categories'>>();
  const { categories, loading } = useAppSelector((state) => state.store);
  const { colors, theme } = useTheme();

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.catItem, { backgroundColor: colors.card, borderColor: colors.border }]} 
      onPress={() => navigation.navigate("CategoryDetail", { categoryName: item.name })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.img }} style={styles.catImg} />
      <Text style={[styles.catText, { color: colors.text }]}>{item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color={colors.primary}/>
        </View>
      ) : (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>CATEGORIES</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id || item.name}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        />
      </>
      )}
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { 
    fontSize: 15, 
    fontFamily: Fonts.bold, 
    letterSpacing: 3,
  },
  catItem: {
    width: (width - 44) / 2,
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  catImg: {
    width: "100%",
    height: 130,
    backgroundColor: "transparent",
    resizeMode: "cover",
  },
  catText: { 
    marginTop: 12, 
    fontSize: 12, 
    fontFamily: Fonts.bold,
    letterSpacing: 1.5,
  },
});
