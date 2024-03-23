import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/AntDesign';

export function useCommonImports() {
  return {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    SafeAreaView,
    ScrollView,
    View,
    ImageBackground,
    Animated,
    useWindowDimensions,
    TouchableOpacity,
    StyleSheet,
    MaterialIcons,
    Text,
    Modal,
  };
}
