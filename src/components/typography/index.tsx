import React, {useMemo} from "react";
import {StyleProp, Text, TextStyle} from "react-native";
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

        return <Text
            {...props}
            style={[style, props.style]}
        />
    }
}

export const Typography = {
    Body: createTextComponent(theme => ({
        fontFamily: "SF Pro Text",
        color: theme.colors.font["1"],
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 21,
        letterSpacing: 0.0025,
        textAlign: "left",
    })),
    Body1: createTextComponent(theme => ({
        fontFamily: "SF Pro Text",
        color: theme.colors.font["1"],
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 22,
        letterSpacing: 0.005,
        textAlign: "left",
    })),
    Caption: createTextComponent(theme => ({
        fontFamily: "SF Pro Text",
        color: theme.colors.font["1"],
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 18,
        letterSpacing: 0.004,
        textAlign: "left",
    })),
    Subtitle: createTextComponent(theme => ({
        fontFamily: "SF Pro Text",
        color: theme.colors.font["1"],
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 24,
        letterSpacing: 0.0015,
        textAlign: "left",
    }))
}
