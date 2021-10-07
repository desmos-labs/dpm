import React, {ReactElement, useCallback} from "react";
import {makeStyle} from "../theming";
import {View} from "react-native";
import {IconButton} from "react-native-paper";
import {Subtitle} from "./Subtitle";
import {StackScreenProps} from "@react-navigation/stack";

export type Props = {
    /**
     * Props regarding of the stack screen to manage.
     */
    stackProps: StackScreenProps<any, any>,
    /**
     * Optional title to display.
     */
    title?: string,
    /**
     * Element to display on the top right corner.
     */
    rightElement?: ReactElement,
}

export const TopBar: React.FC<Props> = (props) => {
    const styles = useStyles();
    const {navigation} = props.stackProps;

    const onBackPressed = useCallback(() => {
        navigation.goBack();
    }, [navigation])

    return <View style={styles.root}>
        <View style={[styles.container, styles.containerLeft]}>
            {navigation.canGoBack() &&
            <IconButton icon="arrow-left" onPress={onBackPressed}/>}
        </View>
        <View style={styles.container}>
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
    containerRight: {
        alignItems: "flex-end",
    },
}))