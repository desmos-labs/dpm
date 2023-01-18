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
    primary: '#ED6C53',
    accent: '#379AFE',
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
    passwordComplexity: {
      weak: '#ecb140',
      normal: '#379afe',
      strong: '#1ec490',
      veryStrong: '#1ec490',
    },
    error: '#fd565f',
  },
};

export default LightTheme;
