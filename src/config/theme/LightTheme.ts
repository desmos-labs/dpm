/* Disable the no-undef lint as the ReactNativePaper namespace will be provided at runtime */
/* eslint-disable no-undef */
import { DefaultTheme } from 'react-native-paper';

export const LightTheme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6C3E',
    accent: '#407AEC',
    background: '#ffffff',
    background2: '#f9f9f9',
    background3: '#dfdfdf',
    popupBackground: 'rgba(0, 0, 0, 0.6)',
    surface: '#f9f9f9',
    surface2: '#ffffff',
    popupSurface: '#ffffff',
    line: '#e8e8e8',
    icon: {
      1: '#0b0b0b',
      2: '#3d3d3d',
      3: '#afafaf',
      4: '#dbdbde',
      5: '#ffffff',
    },
    font: {
      1: '#0b0b0b',
      2: '#3d3d3d',
      3: '#9d9d9d',
      4: '#379afe',
      5: '#ffffff',
      red: '#fd565f',
    },
    toggle: {
      active: '#ED6C53',
      inactive: '#AFAFAF',
    },
    activityIndicator: {
      background: '#f9f9f9',
      foreground: '#e8e8e8',
    },
    passwordComplexity: {
      weak: '#ecb140',
      normal: '#379afe',
      strong: '#1ec490',
      veryStrong: '#1ec490',
    },
    button: {
      primary: '#FF6C3E',
      primaryHover: '#DB553C',
      secondary: '#407AEC',
      secondaryHover: '#265FCC',
      disabled: 'rgba(237, 108, 83, 0.4)',
    },
    error: '#E44A4A',

    // New style colors
    primary100: '#FFF0EC',
    secondary100: '#E9F2FE',
    secondary500: '#267CF4',
    neutral100: '#F7F7F7',
    neutral200: '#EDEDED',
    neutral300: '#E8E8E8',
    neutral700: '#5C5C5C',
    neutral900: '#0A0A0A',
    feedbackSuccess: '#1EC490',
    feedbackSuccessBg: '#DEF9E4',
    feedbackError: '#E44A4A',
    feedbackErrorBg: '#F9DEE3',
    feedbackWarning: '#F9A72D',
  },
};

export default LightTheme;
