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

        interface IconColors {
            1: string,
            2: string,
            3: string,
            4: string,
            5: string,
        }

        interface FontColors {
            1: string,
            2: string,
            3: string,
            4: string,
            5: string,
            red: string,
        }

        interface ThemeColors {
            background2: string,
            /**
             * Profile default
             */
            background3: string,
            popupBackground: string,
            surface2: string,
            popupSurface: string,
            /**
             * Color used for the lines like borders.
             */
            line: string,
            icon: IconColors,
            font: FontColors
            /**
             * Colors used to provide to the user a feedback about the
             * complexity of a password.
             */
            passwordComplexity: ComplexityHintColors,
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
    roundness: 8,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.DesmosOrange,
        accent: Colors.DesmosBlue,
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
        passwordComplexity: {
            weak: "#ecb140",
            normal: "#379afe",
            strong: "#1ec490",
            veryStrong: "#1ec490",
        }
    },
};
