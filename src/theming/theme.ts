import {DefaultTheme} from 'react-native-paper';
import Colors from "../constants/colors";

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            /**
             * Color used for the buttons with mode = contained
             */
            buttonText: string;
            /**
             * Color used for the elements present in the
             * app bar.
             */
            appBarContent: string;
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
        accent: '#edd459',
        buttonText: '#ffffff',
        appBarContent: '#ffffff'
    },
};
