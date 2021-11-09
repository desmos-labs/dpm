import React from "react";
import {IconButton as BaseIconButton, useTheme} from "react-native-paper";


type Props = React.ComponentProps<typeof BaseIconButton>

export const IconButton: React.FC<Props> = (props) => {
    const theme = useTheme();

    return <BaseIconButton
        color={theme.colors.icon["1"]}
        {...props}
        size={props.size ?? 28}
    />

}