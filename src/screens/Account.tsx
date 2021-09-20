import {StyledSafeAreaView} from "../components";
import {FlatList, Image, View} from "react-native";
import {makeStyle} from "../theming";
import {Avatar, Caption, IconButton, Subheading, Surface, FAB} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";
import {cropAddress} from "../utilils/address";
import Clipboard from '@react-native-community/clipboard';
import React from 'react';
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import SettledSession from "../components/SettledSession";
import {useTranslation} from "react-i18next";
import useSelectedAccount from "../hooks/useSelectedAccount";


const useClasses = makeStyle(theme => ({
    root: {
        padding: 0,
    },
    profileHeader: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    coverPicture: {
        width: '100%',
        height: 200,
    },
    detailsContainer: {
        marginTop: -60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.s,
    },
    details: {
        display: "flex",
        flexDirection: "column",
        marginLeft: theme.spacing.s,
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.roundness * 3,
        elevation: 12
    },
    detailsRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        flexGrow: 1,
    },
    username: {
        color: '#ffffff',
        flexGrow: 1,
    },
    dtag: {
        color: '#dfdfdf',
    },
    address: {
        color: '#dfdfdf',
        flexGrow: 1
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

    const accountSessions = sessions.filter(s => {
        return s.state.accounts.find(a => a.indexOf(account.address) >= 0) !== undefined
    });

    const profilePicture = {
        uri: 'https://c.tenor.com/acihnolEVYAAAAAC/goku-hi.gif'
    }
    const coverPicture = {
        uri: 'https://c.tenor.com/CzMleGr4mqYAAAAC/shenron-dragon-ball.gif'
    }

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
        <Surface
            style={classes.profileHeader}
        >
            <Image
                style={classes.coverPicture}
                resizeMode="cover"
                source={coverPicture}
            />
            <View
                style={classes.detailsContainer}
            >
                <Avatar.Image
                    size={120}
                    source={profilePicture}
                >
                </Avatar.Image>
                <Surface
                    style={classes.details}
                >
                    <View
                        style={classes.detailsRow}
                    >
                        <Subheading
                            style={classes.username}
                        >
                            Username
                        </Subheading>
                        <IconButton
                            icon="pencil"
                            color={"#dfdfdf"}
                            onPress={editProfile}
                            size={16}
                        />
                    </View>
                    <Caption
                        style={classes.dtag}
                    >
                        @dtag
                    </Caption>
                    <View
                        style={classes.detailsRow}
                    >
                        <Caption
                            style={classes.address}
                        >
                            {cropAddress(account.address, 6)}
                        </Caption>
                        <IconButton
                            icon="content-copy"
                            size={16}
                            color={"#fff"}
                            onPress={() => Clipboard.setString(account.address)}
                        />
                        <IconButton
                            icon="share-variant"
                            size={16}
                            color={"#fff"}
                            onPress={() => Clipboard.setString(account.address)}
                        />
                    </View>
                </Surface>
            </View>
        </Surface>


        <View
            style={classes.sessions}
        >
            <Subheading>
                {t("dapps")}
            </Subheading>
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