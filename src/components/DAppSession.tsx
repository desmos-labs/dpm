import React, {useCallback, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {DAppSession as DAppSessionType} from "../types/DAppSession";
import {Image, View} from "react-native";
import {Title} from "./Title";
import {makeStyle} from "../theming";
import {format} from "date-fns";
import {Button, Paragraph} from "./index";

export type Props = {
    session: DAppSessionType,
    onRevoke: (session: DAppSessionType) => void;
}

export function DAppSession(props: Props) {
    const {session} = props;
    const {t} = useTranslation();
    const styles = useStyles();

    const onRevokePressed = useCallback(() => {
        props.onRevoke(props.session);
    }, [props]);

    const appIcon = useMemo(() => {
        if (props.session.iconUri === undefined) {
            return require("../assets/desmos-icon-orange.png")
        }
        else {
            return { uri: props.session.iconUri }
        }
    }, [props.session.iconUri]);

    const dateString = useMemo(() => {
        return format(props.session.creationDate, "MMM dd, yyyy");
    }, [props.session.creationDate]);

    const permissionsString = useMemo(() => {
        return props.session.permissions
            .map(permission => `#${permission.toString()}`)
            .join(" ")
    }, [props.session.permissions])

    return <View style={styles.root}>
        <Image
            style={styles.icon}
            source={appIcon}
            resizeMode="center"
        />
        <Title
            style={styles.appName}
        >
            {session.name}
        </Title>
        <Paragraph>{dateString}</Paragraph>
        <Paragraph
            style={styles.permissions}
        >
            {permissionsString}
        </Paragraph>
        <Button
            style={styles.revokeButton}
            mode="contained"
            onPress={onRevokePressed}
        >
            {t("revoke")}
        </Button>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: theme.roundness,
        backgroundColor: theme.colors.background,
        padding: 32,
    },
    icon: {
        width: 60,
        height: 60,
    },
    appName: {
        marginTop: theme.spacing.s,
    },
    permissions: {
        textAlign: "center",
        color: theme.colors.primary,
        marginTop: theme.spacing.s,
    },
    revokeButton: {
        marginTop: theme.spacing.l,
    }
}))