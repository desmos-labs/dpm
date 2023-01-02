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
      /**
       * Colors used to provide to the user a feedback about the
       * complexity of a password.
       */
      passwordComplexity: ComplexityHintColors;
    }

    interface Spacing {
      xs: number | string;
      s: number | string;
      m: number | string;
      l: number | string;
      xl: number | string;
    }

    interface Theme {
      spacing: ReactNativePaper.Spacing;
    }
  }
}
