import {StyledSafeAreaView, Button, Divider} from "../components";
import {makeStyle} from "../theming";
import {IconButton} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AppDrawerParams} from "../types/navigation";
import React, {useCallback, useMemo} from 'react';
import {ProfileHeader} from "../components/ProfileHeader";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import useFetchProfile from "../hooks/useFetchProfile";
import {Image, View, Text} from "react-native";
import {useTranslation} from "react-i18next";


type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "Account">,
    DrawerScreenProps<AppDrawerParams>>;

export default function Account(props: Props): JSX.Element {

    const {navigation} = props;
    const account = props.route.params.account;
    const {t} = useTranslation();
    const styles = useStyles();
    const profile = useFetchProfile(account.address);

    const drawerIconButton = useMemo(() => {
        return <IconButton icon="menu" color="#fff" onPress={() => {
            navigation.openDrawer();
        }}/>
    }, [navigation]);

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
            color="#fff"
            onPress={onEditProfile}
        />) : undefined;
    }, [onEditProfile, profile])

    const onCreateProfile = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account,
                profile: null,
            }
        })
    }, [navigation, account]);

    return <StyledSafeAreaView
        style={styles.root}
    >
        <ProfileHeader
            accountAddress={account.address}
            profile={profile}
            topLeftElement={drawerIconButton}
            topRightElement={editProfileButton}
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
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        padding: 0,
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