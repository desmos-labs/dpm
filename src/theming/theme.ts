import {DefaultTheme} from 'react-native-paper';
import Colors from "../constants/colors";

declare global {
    namespace ReactNativePaper {

        /**
         * Interface that represents the color used to
         * provide to the user a feedback about the complexity
         * of a secret.
         */
        interface ComplexityHintColors {
            weak: string,
            normal: string,
            strong: string,
            veryStrong: string
        }

        interface ThemeColors {
            /**
             * Color used for the icons.
             */
            icon: string,
            /**
             * Color used for the lines like borders.
             */
            line: string,
            /**
             * Color used for the buttons with mode = contained
             */
            buttonText: string;
            /**
             * Color used for the elements present in the
             * app bar.
             */
            appBarContent: string;
            /**
             * Colors used to provide to the user a feedback about the
             * complexity of a password.
             */
            passwordComplexity: ComplexityHintColors
        }

        interface Spacing {
            xs: number | string,
            s: number | string,
            m: number | string,
            l: number | string,
            xl: number | string,
        }

        interface Theme {
            spacing: ReactNativePaper.Spacing,
            test: boolean,
        }
    }
}

export const DefaultSpacing: ReactNativePaper.Spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
}

export const AppTheme: ReactNativePaper.Theme = {
    ...DefaultTheme,
    spacing: DefaultSpacing,
    test: false,
    colors: {
        ...DefaultTheme.colors,
        background: '#ffffff',
        primary: Colors.DesmosOrange,
        accent: Colors.DesmosBlue,
        surface: '#f5f5f5',
        line: '#e8e8e8',
        icon: '#afafaf',
        buttonText: '#ffffff',
        appBarContent: '#ffffff',
        passwordComplexity: {
            weak: "#ecb140",
            normal: "#379afe",
            strong: "#1ec490",
            veryStrong: "#1ec490",
        }
    },
};
