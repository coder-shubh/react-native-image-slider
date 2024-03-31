// import React, { useRef, useState, useEffect } from 'react';
import React from 'react';
import { useCommonImports } from './src/imports';
import {ScrollView } from 'react-native';
import globalStyles from './src/assets/globalStyles';

interface ImageSliderProps {
  images: string[];
  imageHeight?: number;
  dotSize?: number;
  dotColor?: string;
  activeDotColor?: string;
  showNavigationButtons?: boolean;
  showIndicatorDots?: boolean;
  imageLabel?: boolean;
  label?: string;
  extrapolate?: 'clamp' | 'extend' | 'identity';
  autoSlideInterval?: number;
  containerStyle?: any;
  radius?:number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  imageHeight = 250,
  dotSize = 8,
  dotColor = 'silver',
  activeDotColor = 'blue',
  showNavigationButtons = true,
  showIndicatorDots = true,
  imageLabel = true,
  label = '',
  extrapolate = 'clamp',
  autoSlideInterval = 3000, // Auto slide interval in milliseconds
  containerStyle = {}, // Custom style for the indicatorContainer
  radius=5
}) => {
  const {
    SafeAreaView,
    ScrollView,
    View,
    ImageBackground,
    Animated,
    useWindowDimensions,
    TouchableOpacity,
    MaterialIcons,
    Text,
    useState,
    useEffect,
    StyleSheet
  } = useCommonImports();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const styles = globalStyles(StyleSheet);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < images.length - 1) {
        scrollViewRef.current?.scrollTo({
          x: windowWidth * (currentIndex + 1),
          animated: true,
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        scrollViewRef.current?.scrollTo({
          x: 0,
          animated: true,
        });
        setCurrentIndex(0);
      }
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (currentIndex - 1),
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: windowWidth * (currentIndex + 1),
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / windowWidth);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ])}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={1}>
          {images.map((image, imageIndex) => (
            <View
              key={imageIndex}
              style={{ width: windowWidth, height: imageHeight }}>
              <ImageBackground source={{ uri: image }} style={[styles.card,{borderRadius: radius}]}>
                {imageLabel && (
                  <View style={styles.textContainer}>
                    {label ? (
                      <Text style={styles.infoText}>{label}</Text>
                    ) : (
                      <Text
                        style={styles.infoText}>{`Image: ${imageIndex}`}</Text>
                    )}
                  </View>
                )}
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {showNavigationButtons && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.textContainer}
              onPress={handlePrevious}>
              <MaterialIcons
                name={'caretleft'}
                size={20}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.textContainer} onPress={handleNext}>
              <MaterialIcons
                name={'caretright'}
                size={20}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {showIndicatorDots && (
          <View style={[styles.indicatorContainer, containerStyle]}>
            {images.map((_, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [dotSize, dotSize * 2, dotSize],
                extrapolate,
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[
                    styles.normalDot,
                    {
                      width,
                      backgroundColor:
                        currentIndex === imageIndex ? activeDotColor : dotColor,
                    },
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
