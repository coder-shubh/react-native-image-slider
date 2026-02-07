<!-- Title -->
<h1 align="center">@coder-shubh/react-native-image-slider</h1>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/npm/v/@coder-shubh/react-native-image-slider" alt="npm version">
  <!-- Add any other badges here -->
</p>


<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
  <!-- First GIF -->
  <img src="https://raw.githubusercontent.com/coder-shubh/react-native-image-slider/master/src/assets/vid.gif" alt="Demo 1" width="45%">
    <img src="https://raw.githubusercontent.com/coder-shubh/react-native-image-slider/master/src/assets/vido.gif" alt="Demo 1" width="45%">
</div>


<!-- Description -->
<p align="center">
  A customizable and easy-to-use image slider component for React Native.
</p>

<!-- Table of Contents -->
<h2>Table of Contents</h2>

- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [License](#license)

<!-- Installation -->
<h2>Installation</h2>

You can install the `@coder-shubh/react-native-image-slider` package using npm or yarn:

```bash
# with npm
npm i @coder-shubh/react-native-image-slider react-native-vector-icons

# with yarn
yarn add @coder-shubh/react-native-image-slider react-native-vector-icons
```

<!-- Usage -->
<h2>Usage</h2>

<h3>Basic example (URLs only)</h3>

```jsx
import React from 'react';
import { View } from 'react-native';
import ImageSlider from '@coder-shubh/react-native-image-slider';

const IMAGES = [
  'https://cdn.pixabay.com/photo/2022/12/01/04/42/man-7628305_640.jpg',
  'https://cdn.pixabay.com/photo/2023/01/15/20/50/nature-7721372_640.jpg',
  'https://cdn.pixabay.com/photo/2023/02/08/18/00/mountain-7776722_640.jpg',
];

const App = () => (
  <View style={{ flex: 1 }}>
    <ImageSlider
      images={IMAGES}
      imageHeight={250}
      dotSize={10}
      dotColor="silver"
      activeDotColor="blue"
      showNavigationButtons
      showIndicatorDots
      imageLabel
      label="Slide"
      autoSlideInterval={5000}
      containerStyle={{ marginBottom: 20 }}
      radius={8}
    />
  </View>
);

export default App;
```

<h3>Complete example (callbacks, object items, custom styling)</h3>

```jsx
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import ImageSlider from '@coder-shubh/react-native-image-slider';

// Option 1: Array of image URLs (strings)
const urlOnlyImages = [
  'https://cdn.pixabay.com/photo/2022/12/01/04/42/man-7628305_640.jpg',
  'https://cdn.pixabay.com/photo/2023/01/15/20/50/nature-7721372_640.jpg',
];

// Option 2: Array of objects with uri, label (and optional local image via image property)
const objectImages = [
  {
    uri: 'https://cdn.pixabay.com/photo/2022/12/01/04/42/man-7628305_640.jpg',
    label: 'First slide',
  },
  {
    uri: 'https://cdn.pixabay.com/photo/2023/01/15/20/50/nature-7721372_640.jpg',
    label: 'Second slide',
  },
  {
    uri: 'https://cdn.pixabay.com/photo/2023/02/08/18/00/mountain-7776722_640.jpg',
    label: 'Third slide',
  },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>
        Slide {currentIndex + 1} of {objectImages.length}
      </Text>

      <ImageSlider
        images={objectImages}
        imageHeight={280}
        dotSize={8}
        dotColor="#ccc"
        activeDotColor="#2196F3"
        inactiveDotScale={0.8}
        showNavigationButtons
        showIndicatorDots
        imageLabel
        autoSlideInterval={4000}
        loop
        autoplay
        radius={12}
        resizeMode="cover"
        containerStyle={{ marginHorizontal: 0, marginBottom: 16 }}
        paginationStyle={{ marginTop: 8 }}
        dotStyle={{ opacity: 0.6 }}
        activeDotStyle={{ opacity: 1 }}
        navigationButtonStyle={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 10 }}
        iconSize={24}
        iconColor="#fff"
        onIndexChange={(index) => setCurrentIndex(index)}
        onImagePress={(index) => Alert.alert('Slide tapped', `You tapped slide ${index + 1}`)}
        keyExtractor={(item, index) => (typeof item === 'string' ? item : item.uri || String(index))}
        testID="imageSlider_testID"
      />
    </View>
  );
};

export default App;
```

<h3>Custom slide content with renderItem</h3>

```jsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import ImageSlider from '@coder-shubh/react-native-image-slider';

const items = [
  { uri: 'https://example.com/1.jpg', title: 'Banner 1' },
  { uri: 'https://example.com/2.jpg', title: 'Banner 2' },
];

const App = () => (
  <ImageSlider
    images={items}
    imageHeight={200}
    renderItem={(item, index) => (
      <View style={{ width: '100%', height: 200, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>
          {typeof item === 'object' && item.title ? item.title : `Slide ${index + 1}`}
        </Text>
      </View>
    )}
    showIndicatorDots
    showNavigationButtons
  />
);

export default App;
```

<h3>Without autoplay, no loop</h3>

```jsx
<ImageSlider
  images={myImages}
  autoSlideInterval={0}
  autoplay={false}
  loop={false}
  showNavigationButtons
/>
```

<!-- Props -->
<h2>Props</h2>

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `images` | `string[]` or `ImageSliderItem[]` | Image URLs or objects with `uri`/`image` and optional `label`. | required |
| `imageHeight` | `number` | Height of each slide. | `250` |
| `dotSize` | `number` | Size of indicator dots. | `8` |
| `dotColor` | `string` | Color of inactive dots. | `'silver'` |
| `activeDotColor` | `string` | Color of active dot. | `'blue'` |
| `inactiveDotScale` | `number` | Scale for inactive dots. | `1` |
| `showNavigationButtons` | `boolean` | Show prev/next buttons. | `true` |
| `showIndicatorDots` | `boolean` | Show pagination dots. | `true` |
| `imageLabel` | `boolean` | Show label on each slide. | `true` |
| `label` | `string` | Single label for all (or fallback when items have no label). | `''` |
| `extrapolate` | `'clamp' \| 'extend' \| 'identity'` | Dot animation extrapolation. | `'clamp'` |
| `autoSlideInterval` | `number` | Autoplay interval in ms; `0` disables. | `3000` |
| `loop` | `boolean` | Loop to first after last slide. | `true` |
| `autoplay` | `boolean` | Enable autoplay. | `true` |
| `containerStyle` | `ViewStyle` | Container style. | `{}` |
| `paginationStyle` | `ViewStyle` | Pagination dots container style. | - |
| `dotStyle` | `ViewStyle` | Inactive dot style. | - |
| `activeDotStyle` | `ViewStyle` | Active dot style. | - |
| `navigationContainerStyle` | `ViewStyle` | Prev/next buttons container style. | - |
| `navigationButtonStyle` | `ViewStyle` | Prev/next button style. | - |
| `radius` | `number` | Border radius of image cards. | `5` |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'repeat' \| 'center'` | Image resize mode. | `'cover'` |
| `imageStyle` | `ImageStyle` | Style for each image. | - |
| `contentContainerStyle` | `ViewStyle` | ScrollView content container style. | - |
| `onIndexChange` | `(index: number) => void` | Called when the visible slide changes. | - |
| `onImagePress` | `(index: number) => void` | Called when user taps a slide. | - |
| `renderItem` | `(item, index) => ReactNode` | Custom render for each slide. | - |
| `keyExtractor` | `(item, index) => string \| number` | Custom key for list items. | index |
| `prevIcon` | `string` | AntDesign icon name for previous. | `'caretleft'` |
| `nextIcon` | `string` | AntDesign icon name for next. | `'caretright'` |
| `iconSize` | `number` | Nav icon size. | `20` |
| `iconColor` | `string` | Nav icon color. | `'#E3E3E3'` |
| `defaultSource` | `ImageSourcePropType` | Placeholder while image loads. | - |
| `testID` | `string` | Test ID for the root view. | - |

**ImageSliderItem** (when using object form of `images`): `{ uri?: string; image?: ImageSourcePropType; label?: string; [key: string]: any }`


<!-- License -->
<h2>License</h2>

This project is licensed under the MIT License - see the LICENSE file for details.

In this version, I've added:

- Title and badges centered at the top.
- Descriptive text centered.
- Table of Contents for easy navigation.
- Stylish section headings.
- Usage code block with syntax highlighting.
- More visual appeal with horizontal lines and section separators.

Feel free to adjust the styles, colors, or any other aspects to better suit your preferences or project branding.
