
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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image
        source={require("../assets/images/intro.webp")}
        style={styles.image}
      />

      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>SKIP</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.dragIndicator} />
        
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
              <Text style={styles.title}>{item.title.toUpperCase()}</Text>
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
              ? "GET STARTED"
              : "NEXT"}
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
    backgroundColor: "#0C0C0C",
  },

  image: {
    width: "100%",
    height: "62%",
    resizeMode: "cover",
  },

  skip: {
    position: "absolute",
    top: 55,
    right: 20,
    backgroundColor: "rgba(12, 12, 12, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  skipText: {
    fontSize: 11,
    color: "#F5F5F5",
    fontFamily: Fonts.medium,
    letterSpacing: 1.5,
  },

  card: {
    flex: 1,
    backgroundColor: "#121212",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 12,
    alignItems: "center",
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderBottomWidth: 0,
  },

  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },

  slide: {
    width: width - 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1.2,
    lineHeight: 28,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#A0A0A0",
    fontFamily: Fonts.regular,
    lineHeight: 22,
  },

  dots: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 5,
  },

  activeDot: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C5A850",
  },

  button: {
    width: "100%",
    backgroundColor: "#C5A850",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#C5A850",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonText: {
    color: "#0C0C0C",
    fontFamily: Fonts.bold,
    fontSize: 14,
    letterSpacing: 1.5,
  },
});

