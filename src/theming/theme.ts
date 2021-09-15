import { DefaultTheme } from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            /**
             * Color used for the buttons with mode = contained
             */
            buttonText: string;
        }

        interface Theme {
        }
    }
}

export const AppTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#ed6c53',
        accent: '#edd459',
        buttonText: '#ffffff'
    } as Theme["colors"],
};
