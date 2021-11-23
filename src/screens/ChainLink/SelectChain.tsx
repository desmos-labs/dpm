import React, {useCallback} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams} from "../../types/navigation";
import {ListItemSeparator, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {FlatList, Image, ListRenderItemInfo, TouchableOpacity} from "react-native";
import {LinkableChain, LinkableChains} from "../../types/chain";

export type Props = StackScreenProps<ChainLinkScreensStackParams, "SelectChain">

export const SelectChain: React.FC<Props> = ({navigation, route}) => {
    const {importMode, feeGranter, backAction} = route.params
    const {t} = useTranslation();
    const styles = useStyle();

    const linkChain = useCallback((chain: LinkableChain) => {
        console.log(chain);
        navigation.navigate({
            name: "LinkWithMnemonic",
            params: {
                importMode,
                chain,
                feeGranter,
                backAction
            }
        })
    }, [navigation, importMode, feeGranter, backAction])

    const renderListItem = useCallback(({item, index}: ListRenderItemInfo<LinkableChain>) => {
        return <TouchableOpacity
            style={styles.chainItem}
            key={index.toString()}
            onPress={() => linkChain(item)}
        >
            <Image
                style={styles.chainLogo}
                source={item.icon}
                resizeMode="contain"
            />
            <Typography.Body1
                style={styles.chainName}
            >
                {item.name}
            </Typography.Body1>
        </TouchableOpacity>
    }, [styles.chainItem, styles.chainLogo, styles.chainName, linkChain]);

    return <StyledSafeAreaView
        style={styles.background}
        topBar={<TopBar
            style={styles.background}
            stackProps={{navigation}}
            title={t("select chain")}
        />}
    >
        <FlatList
            style={styles.list}
            data={LinkableChains}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ListItemSeparator}
        />
    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    background: {
        backgroundColor: theme.colors.background2
    },
    list: {
        flex: 1,
    },
    topMargin: {
        marginTop: theme.spacing.l
    },
    chainItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background,
        padding: theme.spacing.s,
        borderRadius: theme.roundness,
    },
    chainLogo: {
        width: 32,
        height: 32,
    },
    chainName: {
        marginLeft: theme.spacing.s,
    }
}));