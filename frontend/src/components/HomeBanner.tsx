import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { useAppSelector } from '../store/hooks';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40; // Parent container has marginHorizontal: 20 on both sides

const BANNERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8amV3ZWxzfGVufDB8fDB8fHww',
    subtitle: 'NEW COLLECTION',
    title: 'Luxury Watches & \nFine Jewelry',
  },
  {
    id: '2',
    image: 'https://media.istockphoto.com/id/1276740597/photo/indian-traditional-gold-necklace.webp?a=1&b=1&s=612x612&w=0&k=20&c=hPxwL517Qk0HuDOcs3E_LWgVzZLJQNnpueX58kMRbmE=',
    subtitle: 'SUMMER SPECIAL',
    title: 'Elegance in Every \nDetail',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    subtitle: 'LIMITED EDITION',
    title: 'The Royal Gold \nCollection',
  },
];

export default function HomeBanner() {
  const { banners } = useAppSelector((state) => state.store);
  const displayBanners = banners.length > 0 ? banners : BANNERS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = () => {
    timerRef.current = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= displayBanners.length) {
        nextIndex = 0;
      }
      slidesRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000); // 4 seconds delay
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={displayBanners}
        renderItem={({ item }) => (
          <View style={[styles.bannerItem, { width: ITEM_WIDTH }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        onScrollBeginDrag={stopAutoScroll}
        onScrollEndDrag={startAutoScroll}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {displayBanners.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * ITEM_WIDTH, i * ITEM_WIDTH, (i + 1) * ITEM_WIDTH],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const widthScale = scrollX.interpolate({
            inputRange: [(i - 1) * ITEM_WIDTH, i * ITEM_WIDTH, (i + 1) * ITEM_WIDTH],
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { opacity, width: widthScale }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 190,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0C0C0C',
  },
  bannerItem: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  subtitle: {
    color: '#C5A850', // Luxurious Champagne Gold
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#C5A850',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#C5A850',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#0C0C0C',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pagination: {
    position: 'absolute',
    bottom: 14,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C5A850',
    marginHorizontal: 3,
  },
});
