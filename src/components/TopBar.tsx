import React, {ReactElement} from "react";
import {makeStyle} from "../theming";
import {StyleProp, View, ViewStyle} from "react-native";
import {IconButton} from "react-native-paper";
import {Subtitle} from "./Subtitle";

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
    style?: StyleProp<ViewStyle>
}

export const TopBar: React.FC<Props> = (props) => {
    const styles = useStyles();
    const {navigation} = props.stackProps;

    return <View style={[styles.root, props.style]}>
        <View style={[styles.container, styles.containerLeft]}>
            {navigation.openDrawer ? (
                <IconButton icon="menu" onPress={navigation.openDrawer}/>
            ) : navigation.canGoBack() ? (
                <IconButton icon="arrow-left" onPress={navigation.goBack}/>
            ) : null
            }
        </View>
        <View style={[styles.container, styles.containerCenter]}>
            <Subtitle capitalize>{props.title}</Subtitle>
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
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        alignItems: "center",
    },
    containerLeft: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    containerCenter: {
        position: "absolute",
        left: 0,
        right: 0
    },
    containerRight: {
        alignItems: "flex-end",
    },
}))