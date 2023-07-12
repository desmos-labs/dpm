/* Disable the no-undef lint as the ReactNativePaper namespace will be provided at runtime */
/* eslint-disable no-undef */
import LightTheme from './LightTheme';

const DarkTheme: ReactNativePaper.Theme = {
  ...LightTheme,
  dark: true,
  colors: {
    ...LightTheme.colors,
    primary: '#C35B47',
    accent: '#407AEC',
    background: '#1D1E22',
    background2: '#1D1E22',
    background3: '#292A2E',
    popupBackground: 'rgba(0, 0, 0, 0.7)',
    surface: '#25282D',
    surface2: '#25282D',
    popupSurface: '#1D1E22',
    line: '#34383E',
    icon: {
      1: '#E6E6E6',
      2: '#CBCBCB',
      3: '#AFAFAF',
      4: '#333333',
      5: '#FFFFFF',
    },
    font: {
      1: '#E6E6E6',
      2: '#CBCBCB',
      3: '#9D9D9D',
      4: '#379AFE',
      5: '#FFFFFF',
      red: '#FD565F',
    },
    activityIndicator: {
      background: '#25282D',
      foreground: '#34383E',
    },
    button: {
      primary: '#C35B47',
      primaryHover: '#B33821',
      secondary: '#407AEC',
      secondaryHover: '#265FCC',
      disabled: 'rgba(237, 108, 83, 0.4)',
    },
    text: '#E6E6E6',
    disabled: '#9d9d9d',
    // New style colors
    primary100: '#FFF0EC',
    neutral100: '#25282D',
    neutral200: '#212428',
    neutral900: '#E6E6E6',
    neutral700: '#AFAFAF',
    neutral300: '#E8E8E8',
  },
};

export default DarkTheme;
