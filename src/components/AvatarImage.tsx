import React from "react";
import {Avatar} from "react-native-paper";
import {makeStyle} from "../theming";
import {ImageSourcePropType, StyleProp, StyleSheet, ViewStyle} from "react-native";

export type Props = {
    /**
     * Image to display for the `Avatar`.
     */
    source: ImageSourcePropType,
    /**
     * Size of the avatar.
     */
    size?: number,
    style?:  StyleProp<ViewStyle>
}

export const AvatarImage: React.FC<Props> = (props) => {
    const styles = useStyles();
    const style = StyleSheet.compose(styles.style as StyleProp<ViewStyle>, props.style)

    return <Avatar.Image
        style={style}
        source={props.source}
        size={props.size}/>
}

const useStyles = makeStyle(theme => ({
    style: {
        backgroundColor: theme.colors.surface,
    }
}))