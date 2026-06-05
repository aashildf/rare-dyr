import { Dimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 390; // iPhone 14 — designbase

const { width } = Dimensions.get('window');
const widthRatio = width / BASE_WIDTH;

// Skalerer layout-størrelser (padding, radius, ikoner)
export const scale = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * widthRatio));

// Skalerer fonter — moderat (50 % av full skalering) for lesbarhet
export const rf = (size, factor = 0.5) =>
  Math.round(PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor));
