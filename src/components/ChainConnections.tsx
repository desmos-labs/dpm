import React, {useCallback, useMemo} from "react";
import {FlatList, Image, ListRenderItemInfo, StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {useTranslation} from "react-i18next";
import {Button, ListItemSeparator, Typography} from "./index";
import {makeStyle} from "../theming";
import {ActivityIndicator, useTheme} from "react-native-paper";
import {ChainLink} from "../types/link";
import {LinkableChains} from "../types/chain";

export type Props = {
    connections: ChainLink[],
    onConnectChain?: () => void,
    onShowChainInfo?: (chain: ChainLink) => void,
    loading?: boolean
    style?: StyleProp<ViewStyle>,
}

export const ChainConnections: React.FC<Props> = ({connections, style, onConnectChain, onShowChainInfo, loading}) => {
    const {t} = useTranslation();
    const theme = useTheme();
    const styles = useStyles();
    const noConnections = connections.length === 0 || loading === true;

    const connectChainImage = useMemo(() => {
        return theme.dark ? require("../assets/no-connection-dark.png") :
            require("../assets/no-connection-light.png");
    }, [theme.dark]);

    const renderItem = useCallback((info: ListRenderItemInfo<ChainLink>) => {
        const {item} = info;

        const chainInfo = LinkableChains.find(chain => chain.prefix === item.chainName);
        const chainIcon = chainInfo?.icon ?? require("../assets/chains/cosmos.png");
        const chainName = chainInfo?.name ?? item.chainName;

        return <TouchableOpacity
            style={styles.connectionItem}
            onPress={() => onShowChainInfo !== undefined && onShowChainInfo(item)}
        >
            <Image
                style={styles.chainIcon}
                source={chainIcon}
            />
            <View style={styles.connectionInfo}>
                <Typography.Body1 style={styles.chainName}>{chainName}</Typography.Body1>
                <Typography.Caption2
                    ellipsizeMode={"middle"}
                    numberOfLines={1}
                >
                    {item.externalAddress}
                </Typography.Caption2>
            </View>
        </TouchableOpacity>
    }, [onShowChainInfo, styles.chainIcon, styles.chainName, styles.connectionInfo, styles.connectionItem])

    return <View style={[styles.root, !noConnections ? styles.flexStart : null, style]}>
        {loading === true ? (
            <ActivityIndicator />
        ) : (
            <FlatList
                data={connections}
                renderItem={renderItem}
                keyExtractor={item => item.externalAddress}
                ItemSeparatorComponent={ListItemSeparator}
                ListEmptyComponent={() =>
                    <View style={styles.noConnections}>
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
                    </View>
                }
            />
        )}
        {!noConnections && <Button
            style={[styles.marginTop, styles.marginBottom]}
            onPress={onConnectChain}
            mode="outlined"
        >
            {t("connect chain")}
        </Button> }
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    flexStart: {
        alignSelf: "flex-start"
    },
    noConnections: {
        alignItems: "center",
    },
    noConnectionImage: {
        width: 90,
        height: 90,
    },
    connectionItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    chainIcon: {
        width: 32,
        height: 32,
    },
    connectionInfo: {
        display: "flex",
        flexDirection: "column",
        marginLeft: theme.spacing.s,
    },
    chainName: {
        textTransform: "capitalize"
    },
    marginTop: {
        marginTop: theme.spacing.m,
    },
    marginBottom: {
        marginBottom: theme.spacing.m,
    }
}));