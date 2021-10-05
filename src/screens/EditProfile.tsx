import React, {useCallback, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {StyledSafeAreaView, Button, Divider, InlineInput} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {ProfileHeader} from "../components/ProfileHeader";
import {View} from "react-native";
import {FlexPadding} from "../components/FlexPadding";

type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "EditProfile">,
    StackScreenProps<RootStackParams>>;

export const EditProfile: React.FC<Props> = (props) => {
    const {profile, account} = props.route.params;
    const styles = useStyles();
    const {t} = useTranslation();
    const [dtag, setDtag] = useState(profile?.dtag ?? "");
    const [nickname, setNickname] = useState(profile?.nickname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [profilePicture, setProfilePicture] = useState(undefined);
    const [coverPicture, setCoverPicture] = useState(undefined);

    const onSavePressed = () => {
        props.navigation.navigate({
            name: "ConfirmProfileEdit",
            params: {
                account: account,
                profile: profile,
                newDtag: dtag,
                newNickName: nickname,
                newBio: bio,
                newCoverPicture: profilePicture,
                newProfilePicture: coverPicture
            }
        });
    }

    const onEditCoverPicture = useCallback(() => {
        console.warn("Cover picture picking not supported");
    }, []);

    const onEditProfilePicture = useCallback(() => {
        console.warn("Profile picture picking not supported");
    }, []);

    return <StyledSafeAreaView
        style={styles.root}
    >
        <ProfileHeader
            coverPictureUri={profile?.cachedCoverPictureUri}
            profilePictureUri={profile?.cachedProfilePictureUri}
            onEditCoverPicture={onEditCoverPicture}
            onEditProfilePicture={onEditProfilePicture}
        />
        <View style={styles.content}>
            <InlineInput
                label={t("nickname")}
                placeholder={t("nickname")}
                value={nickname}
                onChangeText={setNickname}
            />
            <Divider/>
            <InlineInput
                label="DTag"
                placeholder="DTag"
                value={dtag}
                onChangeText={setDtag}
            />
            <Divider/>
            <InlineInput
                label={t("bio")}
                placeholder={t("bio")}
                multiline
                numberOfLines={12}
                value={bio}
                onChangeText={setBio}
            />
            <FlexPadding flex={1}/>
            <Button
                style={styles.saveBtn}
                mode="contained"
                onPress={onSavePressed}
                disabled={dtag.length === 0}
            >
                {t("next")}
            </Button>
        </View>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        padding: 0,
        display: "flex",
        flexDirection: "column",
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
    },
    input: {},
    saveBtn: {
        marginTop: theme.spacing.m
    }
}))