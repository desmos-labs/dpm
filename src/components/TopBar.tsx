import React, {ReactElement} from "react";
import {makeStyle} from "../theming";
import {Platform, StatusBar, StyleProp, View, ViewStyle} from "react-native";
import {IconButton} from "./IconButton";
import {Typography} from "./index";

type ScreenProps = {
    navigation: {
        readonly goBack: () => void,
        readonly canGoBack: () => boolean,
        readonly openDrawer?: () => void,
    }
}

export type Props = {
    /**
     * Props regarding of the stack screen to manage.
     */
    stackProps: ScreenProps,
    /**
     * Optional title to display.
     */
    title?: string,
    /**
     * Element to display on the top right corner.
     */
    rightElement?: ReactElement,
    /**
     * Color of the top left icon.
     */
    leftIconColor?: string
    style?: StyleProp<ViewStyle>
}

export const TopBar: React.FC<Props> = (props) => {
    const styles = useStyles();
    const {navigation} = props.stackProps;

    return <View style={[styles.root, props.style]}>
        <View style={[styles.container, styles.containerLeft]}>
            {navigation.openDrawer ? (
                <IconButton
                    color={props.leftIconColor}
                    icon="menu"
                    onPress={navigation.openDrawer}
                />
            ) : navigation.canGoBack() ? (
                <IconButton
                    color={props.leftIconColor}
                    icon="back"
                    onPress={navigation.goBack}
                />
            ) : null
            }
        </View>
        <View style={[styles.container, styles.containerCenter]}>
            <Typography.Subtitle style={styles.title}>
                {props.title}
            </Typography.Subtitle>
        </View>
        <View style={[styles.container, styles.containerRight]}>
            {props.rightElement}
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 32,
    },
    container: {
        flex: 1,
        alignItems: "center",
    },
    containerLeft: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 1,
    },
    containerCenter: {
        flex: 2,
    },
    title: {
        textTransform: "capitalize",
    },
    containerRight: {
        alignItems: "flex-end",
        zIndex: 1,
    },
}))