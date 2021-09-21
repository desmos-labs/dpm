import {StyledSafeAreaView} from "../components";
import {FlatList, View} from "react-native";
import {makeStyle} from "../theming";
import {FAB, Title} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";
import React, {useEffect} from 'react';
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import SettledSession from "../components/SettledSession";
import {useTranslation} from "react-i18next";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {ProfileHeader} from "../components/ProfileHeader";
import useProfile from "../hooks/useProfile";
import useFetchProfile from "../hooks/useFetchProfile";


const useClasses = makeStyle(theme => ({
    root: {
        padding: 0,
    },
    sessions: {
        padding: theme.spacing.m,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}))

type Props = StackScreenProps<RootStackParams, "Account">;

export default function Account(props: Props): JSX.Element {

    const {navigation} = props;
    const {t} = useTranslation();
    const classes = useClasses();
    const sessions = useRecoilValue(WalletConnectStore.settledSessions);
    const account = useSelectedAccount()!;
    const profile = useProfile();
    const fetchProfile = useFetchProfile();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile])

    const accountSessions = sessions.filter(s => {
        return s.state.accounts.find(a => a.indexOf(account.address) >= 0) !== undefined
    });

    const editProfile = () => {
        console.log("edit user profile");
    }

    const pairNewDapp = () => {
        navigation.navigate({
            name: "NewWalletSession",
            params: {
                account,
            },
        });
    }

    return <StyledSafeAreaView
        style={classes.root}
    >
        <ProfileHeader
            accountAddress={account.address}
            profile={profile}
            openProfileEdit={editProfile}
        />
        <View
            style={classes.sessions}
        >
            <Title>
                {t("dapps")}
            </Title>
            <FlatList
                data={accountSessions}
                renderItem={({item}) => <SettledSession session={item}/>}
            />
        </View>

        <FAB
            style={classes.fab}
            icon="qrcode-plus"
            onPress={pairNewDapp}
        />

    </StyledSafeAreaView>
}