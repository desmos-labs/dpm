import React from "react";
import {View} from "react-native";
import {makeStyle} from "../theming";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";

export type Props = StackScreenProps<RootStackParams, "ModalScreen">

export const ModalScreen: React.FC<Props> = (props) => {
    const styles = useStyles();
    const {component, params} = props.route.params;
    const ModalContent = component;

    return <View style={styles.root}>
        <View style={styles.content}>
            <ModalContent navigation={props.navigation} params={params}/>
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        backgroundColor: "#fff",
        elevation: 4,
        borderRadius: theme.roundness,
        padding: theme.spacing.l,
        alignItems: "center",
    },
    successImage: {
        width: 200,
        height: 100,
    }
}));