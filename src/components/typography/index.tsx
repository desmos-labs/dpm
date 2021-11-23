import React, {useMemo} from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {useTheme} from "react-native-paper";

export type TypographyComponentProps = React.ComponentProps<typeof Text>;

function createTextComponent(
    styleProvider: (theme: ReactNativePaper.Theme) => StyleProp<TextStyle>
): React.FC<TypographyComponentProps> {
    return (props) => {
        const theme = useTheme()
        const style = useMemo(() => {
            return styleProvider(theme);
        }, [theme]);

        const commonStyle = useMemo<StyleProp<TextStyle>>(() => {
            return {
                color: theme.colors.font["1"]
            }
        }, [theme]);

        return <Text
            {...props}
            style={StyleSheet.compose([commonStyle, style], props.style)}
        />
    }
}

export const Typography = {
    Body: createTextComponent(_ => ({
        fontFamily: "Poppins-Regular",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 21,
        letterSpacing: 0.0025,
        textAlign: "left",
    })),
    Body1: createTextComponent(_ => ({
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 22,
        letterSpacing: 0.005,
        textAlign: "left",
    })),
    Caption: createTextComponent(_ => ({
        fontFamily: "Poppins-Regular",
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 18,
        letterSpacing: 0.004,
        textAlign: "left",
    })),
    Caption2: createTextComponent(_ => ({
        fontFamily: "Poppins-Regular",
        fontSize: 10,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 15,
        letterSpacing: 0.004,
        textAlign: "left",
    })),
    Title: createTextComponent(_ => ({
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        fontSize: 22,
    })),
    Subtitle: createTextComponent(_ => ({
        fontFamily: "Poppins-Medium",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 24,
        letterSpacing: 0.0015,
        textAlign: "left",
    })),
    Subtitle2: createTextComponent(_ => ({
        fontFamily: "Poppins-Medium",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 21,
        letterSpacing: 0.001,
        textAlign: "left",
    })),
    H1: createTextComponent(_ => ({
        fontFamily: "Poppins-SemiBold",
        fontSize: 32,
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: 48,
        letterSpacing: 0.0025,
        textAlign: "left",
    })),
    H2: createTextComponent(_ => ({
        fontFamily: "Poppins-SemiBold",
        fontSize: 24,
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: 36,
        letterSpacing: 0.0015,
        textAlign: "left",
    }))
}
