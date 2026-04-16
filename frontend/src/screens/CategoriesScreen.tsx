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
import Icon from "react-native-vector-icons/Ionicons"; // using Ionicons here
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StoreContext } from "../context/StoreContext";
import { ActivityIndicator } from "react-native";
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
  const { categories, loading } = React.useContext(StoreContext);
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.catItem}    onPress={() => navigation.navigate("CategoryDetail", { categoryName: item.name })}
>
      <Image source={{ uri: item.img }} style={styles.catImg} />
      <Text style={styles.catText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {loading ? (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#D4AF37"/>
        </View>
      ) : (
      <>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>All Categories</Text>
          <Icon name="search-outline" size={24} color="#000" />
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id || item.name}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        />
      </>
      )}
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  backText: { fontSize: 16, color: "#B8860B" },
  title: { fontSize: 20, fontWeight: "bold", color: "#000" },
  catItem: {
    width: (width - 60) / 2,
    alignItems: "center",
  },
  catImg: {
    width: (width - 60) / 2,
    height: 120,
    backgroundColor: "#eee",
  },
  catText: { marginTop: 8, fontSize: 14, fontWeight: "500" },
});
