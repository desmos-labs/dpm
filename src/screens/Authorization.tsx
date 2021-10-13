import React from "react";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, AppDrawerParams, HomeScreenBottomTabsParams} from "../types/navigation";
import {FlatList, Text, View} from "react-native";
import {ListItemSeparator, StyledSafeAreaView, Title, TopBar} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";
import {useTranslation} from "react-i18next";
import useWalletConnectSessions from "../hooks/useWalletConnectSessions";
import useSelectedAccount from "../hooks/useSelectedAccount";

export type Props = CompositeScreenProps<
    BottomTabScreenProps<HomeScreenBottomTabsParams, "Authorization">,
    CompositeScreenProps<
        DrawerScreenProps<AppDrawerParams>, StackScreenProps<AccountScreensStackParams>>
    >;

export const Authorization: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const currentAccount = useSelectedAccount()
    const sessions = useWalletConnectSessions(currentAccount);

    return <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t("authorization")}/>}
    >
        <FlatList
            data={sessions}
            renderItem={({item}) => {
                return <View>
                    <Title>{item.peerMeta?.name ?? "Unknown DApp"}</Title>
                    <Text>{item.id}</Text>
                </View>
            }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ListItemSeparator}
        />
    </StyledSafeAreaView>
}