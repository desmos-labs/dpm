import { DimensionValue } from 'react-native';

// treat this file as a module.
export {};

declare global {
  namespace ReactNativePaper {
    /**
     * Interface that represents the color used to
     * provide to the user a feedback about the complexity
     * of a secret.
     */
    interface ComplexityHintColors {
      weak: string;
      normal: string;
      strong: string;
      veryStrong: string;
    }

    interface IconColors {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    }

    interface FontColors {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      red: string;
    }

    interface ToggleColors {
      active: string;
      inactive: string;
    }

    interface ActivityIndicatorColors {
      background: string;
      foreground: string;
    }

    interface ButtonColors {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
      disabled: string;
    }

    interface ThemeColors {
      background2: string;
      /**
       * Profile default
       */
      background3: string;
      popupBackground: string;
      surface2: string;
      popupSurface: string;
      /**
       * Color used for the lines like borders.
       */
      line: string;
      icon: IconColors;
      font: FontColors;
      toggle: ToggleColors;
      activityIndicator: ActivityIndicatorColors;
      /**
       * Colors used to provide to the user a feedback about the
       * complexity of a password.
       */
      passwordComplexity: ComplexityHintColors;
      /**
       * Color used for the buttons.
       */
      button: ButtonColors;

      shadow: string;

      // New style colors
      primary100: string;
      secondary100: string;
      secondary500: string;
      neutral100: string;
      neutral200: string;
      neutral300: string;
      neutral700: string;
      neutral900: string;
      feedbackSuccess: string;
      feedbackSuccessBg: string;
      feedbackError: string;
      feedbackErrorBg: string;
      feedbackWarning: string;
    }

    interface Spacing {
      xs: DimensionValue;
      s: DimensionValue;
      m: DimensionValue;
      l: DimensionValue;
      xl: DimensionValue;
    }

    interface Theme {
      spacing: ReactNativePaper.Spacing;
    }
  }
}
