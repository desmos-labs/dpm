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
    popupSurface: '#25282D',
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
    text: '#E6E6E6',
    disabled: '#9d9d9d',
  },
};

export default DarkTheme;
