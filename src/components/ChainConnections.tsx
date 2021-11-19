import React, {useMemo} from "react";
import {Image, StyleProp, View, ViewStyle} from "react-native";
import {useTranslation} from "react-i18next";
import {Typography, Button} from "./index";
import {makeStyle} from "../theming";
import {useTheme} from "react-native-paper";

export type Props = {
    connections: any[],
    onConnectChain: () => void,
    style?: StyleProp<ViewStyle>
}

export const ChainConnections: React.FC<Props> = ({connections, style, onConnectChain}) => {
    const {t} = useTranslation();
    const theme = useTheme();
    const styles = useStyles();

    const connectChainImage = useMemo(() => {
        return theme.dark ? require("../assets/no-connection-dark.png") :
            require("../assets/no-connection-light.png");
    }, [theme.dark])

    return <View style={[styles.root, style]}>
        {connections.length === 0 ? (
            <>
                <Image
                    style={styles.noConnectionImage}
                    resizeMode="cover"
                    source={connectChainImage}
                />
                <Typography.Body>
                    {t("connect your chain account")}
                </Typography.Body>

                <Button
                    style={[styles.marginTop]}
                    onPress={onConnectChain}
                    mode="outlined"
                >
                    {t("connect chain")}
                </Button>
            </>
        ) : null}
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    noConnectionImage: {
        width: 90,
        height: 90,
    },
    marginTop: {
        marginTop: theme.spacing.m,
    }
}));