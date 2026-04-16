
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Fonts } from "../constants/fonts";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Premium Jewellery Collections",
    subtitle:
      "Discover beautiful gold and diamond jewellery crafted with elegance.",
  },
  {
    id: "2",
    title: "Bridal & Festive Designs",
    subtitle:
      "Explore exclusive wedding and festive jewellery collections.",
  },
  {
    id: "3",
    title: "Trusted & Certified",
    subtitle:
      "All our jewellery comes with guaranteed purity and certification.",
  },
];

const IntroScreen = () => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.navigate("Signup");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require("../assets/images/intro.webp")}
        style={styles.image}
      />

      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          )}
        />

        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  image: {
    width: "100%",
    height: "65%",
    resizeMode: "cover",
  },

  skip: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#ffffffcc",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  skipText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: "center",
    marginTop: -30,
  },

  slide: {
    width: width - 48,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    fontFamily: Fonts.regular,
  },

  dots: {
    flexDirection: "row",
    marginVertical: 24,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 18,
    backgroundColor: "#B8860B",
  },

  button: {
    width: "100%",
    backgroundColor: "#B8860B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
});

