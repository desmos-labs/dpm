import {Button, ChainConnections, Divider, IconButton, StyledSafeAreaView, TopBar, Typography} from "../components";
import {makeStyle} from "../theming";
import {Snackbar, useTheme} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import React, {useCallback, useMemo, useState} from 'react';
import {ProfileHeader} from "../components/ProfileHeader";
import useFetchProfile from "../hooks/useFetchProfile";
import {ScrollView, View} from "react-native";
import {useTranslation} from "react-i18next";
import Clipboard from "@react-native-community/clipboard";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {ChainLink} from "../types/link";
import useChainLinks from "../hooks/useChainLinks";
import {DpmImage} from "../components";


export type Props = StackScreenProps<AccountScreensStackParams, "Profile">

export default function Profile(props: Props): JSX.Element {
    const {navigation} = props;
    const account = useSelectedAccount();
    const {t} = useTranslation();
    const styles = useStyles();
    const theme = useTheme();
    const profile = useFetchProfile(account.address);
    const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
    const chainLinks = useChainLinks(account.address);

    const onEditProfile = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account,
                profile,
            }
        })
    }, [navigation, profile, account]);

    const editProfileButton = useMemo(() => {
        return profile ? (<IconButton
            icon="edit"
            color={theme.colors.icon["5"]}
            onPress={onEditProfile}
        />) : undefined;
    }, [onEditProfile, profile, theme])

    const onCreateProfile = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account,
                profile: null,
            }
        })
    }, [navigation, account]);

    const onAddressCopy = useCallback(() => {
        Clipboard.setString(account.address)
        setShowSnackbar(t("address copied"));
    }, [t, account]);

    const connectChain = useCallback(() => {
        navigation.navigate({
            name: "ChainLinkScreens",
            params: {
                screen: "ConnectChain",
                params: {},
            },
        })
    }, [navigation]);

    const showChainLinkInfo = useCallback((chainLink: ChainLink) => {
        navigation.navigate({
            name: "ChainLinkDetails",
            params: {
                chainLink
            }
        })
    }, [navigation]);

    return <StyledSafeAreaView
        padding={0}
        topBar={<TopBar
            style={styles.topBar}
            leftIconColor={theme.colors.icon["5"]}
            stackProps={props}
            rightElement={editProfileButton}
        />}
    >
        <ProfileHeader
            address={account.address}
            coverPictureUri={profile?.coverPicture}
            profilePictureUri={profile?.profilePicture}
            dtag={profile?.dtag}
            nickname={profile?.nickname}
            onCopyPressed={onAddressCopy}
        />
        <Divider style={styles.profileHeaderDivider}/>
        <View
            style={styles.content}
            onStartShouldSetResponder={() => true}
        >
            {profile ? (
                <>
                    <ScrollView
                        style={styles.bioContainer}
                    >
                        <Typography.Body1 style={styles.bio}>
                            {profile.bio}
                        </Typography.Body1>
                    </ScrollView>
                    <ChainConnections
                        style={styles.chainConnections}
                        connections={chainLinks}
                        onConnectChain={connectChain}
                        onShowChainInfo={showChainLinkInfo}
                    />
                </>
            ) : <>
                <DpmImage
                    style={styles.noProfileImage}
                    source="no-profile"
                    resizeMode="contain"
                />
                <Typography.Body1>
                    {t("create first desmos profile")}
                </Typography.Body1>
                <Button
                    style={styles.createProfileBtn}
                    mode="outlined"
                    onPress={onCreateProfile}
                >
                    {t("create profile")}
                </Button>
            </>}
        </View>
        <Snackbar
            visible={snackBarMessage !== null}
            onDismiss={() => setShowSnackbar(null)}
            action={{
                label: t("hide")
            }}
            duration={Snackbar.DURATION_SHORT}
        >
            {snackBarMessage}
        </Snackbar>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    topBar: {
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    },
    profileHeaderDivider: {
        width: 63,
        alignSelf: "flex-start",
        marginStart: 16,
        marginTop: 16,
    },
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexGrow: 1,
        paddingHorizontal: theme.spacing.m,
    },
    bioContainer: {
        flex: 2,
    },
    bio: {
        marginTop: theme.spacing.s,
    },
    chainConnections: {
        flex: 3,
        marginTop: theme.spacing.s,
    },
    noProfileImage: {
        marginTop: 42,
        height: 140,
    },
    createProfileBtn: {
        marginTop: theme.spacing.m,
    }
}))