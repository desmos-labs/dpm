import {StyledSafeAreaView, Button, Divider, IconButton} from "../components";
import {makeStyle} from "../theming";
import {Snackbar, useTheme} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import React, {useCallback, useMemo, useState} from 'react';
import {ProfileHeader} from "../components/ProfileHeader";
import useFetchProfile from "../hooks/useFetchProfile";
import {Image, View, Text} from "react-native";
import {useTranslation} from "react-i18next";
import Clipboard from "@react-native-community/clipboard";
import useSelectedAccount from "../hooks/useSelectedAccount";


export type Props = StackScreenProps<AccountScreensStackParams, "Profile">

export default function Profile(props: Props): JSX.Element {

    const {navigation} = props;
    const account = useSelectedAccount();
    const {t} = useTranslation();
    const styles = useStyles();
    const theme = useTheme();
    const profile = useFetchProfile(account.address);
    const [snackBarMessage, setShowSnackbar] = useState<string | null>(null)

    const backIcon = useMemo(() => {
        return <IconButton
            icon="arrow-left"
            color={theme.colors.icon["5"]}
            onPress={() => {
                navigation.goBack();
            }}/>
    }, [navigation, theme]);

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
            icon="pencil"
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

    return <StyledSafeAreaView padding={0}>
        <ProfileHeader
            address={account.address}
            coverPictureUri={profile?.cachedCoverPictureUri}
            profilePictureUri={profile?.cachedProfilePictureUri}
            dtag={profile?.dtag}
            nickname={profile?.nickname}
            topLeftElement={backIcon}
            topRightElement={editProfileButton}
            onCopyPressed={onAddressCopy}
        />
        <Divider style={styles.profileHeaderDivider}/>
        <View style={styles.content}>
            {profile ? (
                <>
                    <Text style={styles.bio}>
                        {profile.bio}
                    </Text>
                </>
            ) : <>
                <Image
                    style={styles.noProfileImage}
                    source={require("../assets/no-profile.png")}
                    resizeMode="contain"
                />
                <Text>
                    {t("add your first desmos profile now")}
                </Text>
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
    bio: {
        marginTop: theme.spacing.s,
    },
    noProfileImage: {
        width: 140,
        height: 140,
    },
    createProfileBtn: {
        marginTop: theme.spacing.m,
    }
}))