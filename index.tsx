import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/AntDesign";

export type ImageSliderResizeMode = "cover" | "contain" | "stretch" | "repeat" | "center";

export interface ImageSliderItem {
  uri?: string;
  image?: ImageSourcePropType;
  label?: string;
  [key: string]: any;
}

export interface ImageSliderProps {
  /** Image URLs or array of items with uri/image and optional label */
  images: string[] | ImageSliderItem[];
  imageHeight?: number;
  dotSize?: number;
  dotColor?: string;
  activeDotColor?: string;
  /** Scale factor for inactive dots (default 1) */
  inactiveDotScale?: number;
  showNavigationButtons?: boolean;
  showIndicatorDots?: boolean;
  imageLabel?: boolean;
  /** Single label for all images, or use item.label when images is ImageSliderItem[] */
  label?: string;
  extrapolate?: "clamp" | "extend" | "identity";
  /** Auto-slide interval in ms (0 = disabled) */
  autoSlideInterval?: number;
  /** Loop back to first slide after last (default true when autoSlideInterval > 0) */
  loop?: boolean;
  /** Enable/disable autoplay (default true when autoSlideInterval > 0) */
  autoplay?: boolean;
  containerStyle?: ViewStyle;
  /** Style for the pagination dots container */
  paginationStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
  /** Style for prev/next button container */
  navigationContainerStyle?: ViewStyle;
  navigationButtonStyle?: ViewStyle;
  radius?: number;
  testID?: string;
  /** Resize mode for images (cover, contain, stretch, etc.) */
  resizeMode?: ImageSliderResizeMode;
  imageStyle?: ImageStyle;
  contentContainerStyle?: ViewStyle;
  /** Callback when slide index changes */
  onIndexChange?: (index: number) => void;
  /** Callback when an image is pressed */
  onImagePress?: (index: number) => void;
  /** Custom render for each slide (receives item, index); overrides default image */
  renderItem?: (item: ImageSliderItem | string, index: number) => React.ReactNode;
  /** Custom key extractor for list items */
  keyExtractor?: (item: ImageSliderItem | string, index: number) => string | number;
  /** Custom previous icon name (AntDesign) */
  prevIcon?: string;
  /** Custom next icon name (AntDesign) */
  nextIcon?: string;
  /** Icon size for navigation buttons */
  iconSize?: number;
  /** Icon color for navigation buttons */
  iconColor?: string;
  /** Placeholder image source while loading */
  defaultSource?: ImageSourcePropType;
}

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  normalDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "absolute",
    width: "100%",
    bottom: "53%",
  },
  navButton: {
    padding: 8,
  },
  closeIcon: {
    width: "100%",
    height: "100%",
    color: "#E3E3E3",
  },
});

function isImageItem(item: string | ImageSliderItem): item is ImageSliderItem {
  return typeof item === "object" && (item !== null) && ("uri" in item || "image" in item);
}

function getImageSource(item: string | ImageSliderItem): { uri: string } | ImageSourcePropType {
  if (typeof item === "string") return { uri: item };
  if (item.image) return item.image;
  if (item.uri) return { uri: item.uri };
  return { uri: "" };
}

function getItemLabel(item: string | ImageSliderItem, index: number, fallbackLabel?: string): string {
  if (typeof item === "string") return fallbackLabel ?? `Image: ${index}`;
  if (item.label) return item.label;
  return fallbackLabel ?? `Image: ${index}`;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  imageHeight = 250,
  dotSize = 8,
  dotColor = "silver",
  activeDotColor = "blue",
  inactiveDotScale = 1,
  showNavigationButtons = true,
  showIndicatorDots = true,
  imageLabel = true,
  label = "",
  extrapolate = "clamp",
  autoSlideInterval = 3000,
  loop = true,
  autoplay = true,
  containerStyle = {},
  paginationStyle,
  dotStyle,
  activeDotStyle,
  navigationContainerStyle,
  navigationButtonStyle,
  radius = 5,
  testID,
  resizeMode = "cover",
  imageStyle,
  contentContainerStyle,
  onIndexChange,
  onImagePress,
  renderItem,
  keyExtractor,
  prevIcon = "caretleft",
  nextIcon = "caretright",
  iconSize = 20,
  iconColor = "#E3E3E3",
  defaultSource,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const items = Array.isArray(images) ? images : [];
  const itemCount = items.length;

  const safeSetIndex = useCallback(
    (next: number) => {
      const idx = next < 0 ? (loop ? itemCount - 1 : 0) : next >= itemCount ? (loop ? 0 : itemCount - 1) : next;
      setCurrentIndex(idx);
      onIndexChange?.(idx);
    },
    [itemCount, loop, onIndexChange]
  );

  useEffect(() => {
    if (!autoplay || autoSlideInterval <= 0 || itemCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= itemCount) {
          if (loop) {
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
            onIndexChange?.(0);
            return 0;
          }
          return prev;
        }
        scrollViewRef.current?.scrollTo({ x: windowWidth * next, animated: true });
        onIndexChange?.(next);
        return next;
      });
    }, autoSlideInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoSlideInterval, loop, itemCount, windowWidth, onIndexChange]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (currentIndex - 1),
        animated: true,
      });
      safeSetIndex(currentIndex - 1);
    } else if (loop) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (itemCount - 1),
        animated: true,
      });
      safeSetIndex(itemCount - 1);
    }
  }, [currentIndex, itemCount, loop, windowWidth, safeSetIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < itemCount - 1) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (currentIndex + 1),
        animated: true,
      });
      safeSetIndex(currentIndex + 1);
    } else if (loop) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      safeSetIndex(0);
    }
  }, [currentIndex, itemCount, loop, windowWidth, safeSetIndex]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / windowWidth);
      const clamped = Math.max(0, Math.min(index, itemCount - 1));
      setCurrentIndex(clamped);
      onIndexChange?.(clamped);
    },
    [windowWidth, itemCount, onIndexChange]
  );

  if (itemCount === 0) return null;

  return (
    <SafeAreaView testID={testID} style={[defaultStyles.container, containerStyle]}>
      <View style={[defaultStyles.scrollContainer, { height: imageHeight + 8 }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={contentContainerStyle}
        >
          {items.map((item, imageIndex) => {
            const source = getImageSource(item);
            const key = keyExtractor ? keyExtractor(item, imageIndex) : imageIndex;

            const slideContent = renderItem ? (
              renderItem(item, imageIndex)
            ) : (
              <View style={{ width: windowWidth, height: imageHeight }}>
                <ImageBackground
                  source={source}
                  style={[defaultStyles.card, { borderRadius: radius }, imageStyle]}
                  resizeMode={resizeMode}
                  defaultSource={defaultSource}
                  onError={() => console.warn("Image failed to load.")}
                >
                  <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={onImagePress ? 0.9 : 1}
                    onPress={() => onImagePress?.(imageIndex)}
                    accessible
                    accessibilityRole="image"
                    accessibilityLabel={`Slide ${imageIndex + 1} of ${itemCount}`}
                  >
                    {imageLabel && (
                      <View style={defaultStyles.textContainer}>
                        <Text style={defaultStyles.infoText}>
                          {getItemLabel(item, imageIndex, label)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            );

            return <View key={String(key)}>{slideContent}</View>;
          })}
        </ScrollView>

        {showNavigationButtons && (
          <View style={[defaultStyles.navigationContainer, navigationContainerStyle]}>
            <TouchableOpacity
              style={[defaultStyles.navButton, navigationButtonStyle]}
              onPress={handlePrevious}
              accessible
              accessibilityLabel="Previous slide"
              accessibilityRole="button"
            >
              <MaterialIcons name={prevIcon} size={iconSize} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[defaultStyles.navButton, navigationButtonStyle]}
              onPress={handleNext}
              accessible
              accessibilityLabel="Next slide"
              accessibilityRole="button"
            >
              <MaterialIcons name={nextIcon} size={iconSize} color={iconColor} />
            </TouchableOpacity>
          </View>
        )}

        {showIndicatorDots && (
          <View style={[defaultStyles.indicatorContainer, paginationStyle]}>
            {items.map((_, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [dotSize * inactiveDotScale, dotSize * 2, dotSize * inactiveDotScale],
                extrapolate,
              });
              const isActive = currentIndex === imageIndex;
              return (
                <Animated.View
                  key={imageIndex}
                  style={[
                    defaultStyles.normalDot,
                    { width, height: dotSize, borderRadius: dotSize / 2 },
                    { backgroundColor: isActive ? activeDotColor : dotColor },
                    isActive ? activeDotStyle : dotStyle,
                  ]}
                />
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImageSlider;
