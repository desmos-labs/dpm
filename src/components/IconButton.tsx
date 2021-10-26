import React from "react";
import {IconButton as BaseIconButton} from "react-native-paper";


type Props = React.ComponentProps<typeof BaseIconButton>

export const IconButton: React.FC<Props> = (props) => {
    return <BaseIconButton
        {...props}
        size={props.size ?? 28}
    />

}