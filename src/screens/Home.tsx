import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, HomeScreensBottomTabsParams, HomeScreensDrawerParams} from "../types/navigation";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";
import React, {useCallback, useMemo} from "react";
import {AvatarImage, StyledSafeAreaView, Title, TopBar} from "../components";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {useTranslation} from "react-i18next";
import useFetchProfile from "../hooks/useFetchProfile";
import {makeStyle} from "../theming";

export type Props = CompositeScreenProps<BottomTabScreenProps<HomeScreensBottomTabsParams, "Home">,
    CompositeScreenProps<DrawerScreenProps<HomeScreensDrawerParams>, StackScreenProps<AccountScreensStackParams>>>;

export const Home: React.FC<Props> = (props) => {
    const {navigation} = props;
    const account = useSelectedAccount();
    const {t} = useTranslation();
    const styles = useStyles();
    const profile = useFetchProfile(account.address);

    const openProfileDetails = useCallback(() => {
        navigation.navigate({
            name: "Profile",
            params: undefined,
        })
    }, [navigation])

    const profilePicture = useMemo(() => {
        return <AvatarImage
            size={30}
            style={styles.avatarImage}
            source={profile?.cachedProfilePictureUri ? {
                uri: profile.cachedProfilePictureUri
            } : require("../assets/default-profile-picture.png")}
            onPress={openProfileDetails}
        />
    }, [styles,profile, openProfileDetails]);

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={props}
            rightElement={profilePicture}
        />}
    >
        <Title>{t("home")}</Title>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    avatarImage: {
        right: 16,
    }
}))