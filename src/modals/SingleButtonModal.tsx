import React, {useCallback} from "react";
import {Image, ImageSourcePropType, View} from "react-native";
import {makeStyle} from "../theming";
import {Button, Paragraph, Title} from "../components";
import {ModalComponent, RootStackParams} from "../types/navigation";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";

export type SingleButtonModalParams = {
    /**
     * Modal title.
     */
    title: string,
    /**
     * Modal message.
     */
    message: string,
    /**
     * Optional image that will be displayed on top
     * of the title.
     */
    image?: ImageSourcePropType,
    /**
     * Text displayed on the action button.
     */
    actionLabel: string,
    /**
     * Function called when the user clicks on the button.
     */
    action: (navigation: StackNavigationProp<RootStackParams>) => void,
}

export const SingleButtonModal: ModalComponent<SingleButtonModalParams> = (props) => {
    const {params, navigation} = props;
    const styles = useStyles();

    const btnAction = useCallback(() => {
        params.action(navigation);
    }, [params, navigation])

    return <View style={styles.root}>
        {params.image && <Image
            style={styles.image}
            resizeMode="contain"
            source={params.image}
        />}
        <Title
            style={[styles.centred, styles.title]}
        >
            {params.title}
        </Title>
        <Paragraph
            style={styles.centred}
        >
            {params.message}
        </Paragraph>
        <Button
            style={styles.button}
            mode="contained"
            onPress={btnAction}
        >
            {params.actionLabel}
        </Button>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {

    },
    image: {
        alignSelf: "center",
        width: 200,
        height: 100,
    },
    title: {
        marginTop: theme.spacing.s,
    },
    button: {
        marginTop: theme.spacing.m,
    },
    centred: {
        alignSelf: "center"
    },
}));