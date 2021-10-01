import React, {useCallback, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {StyledSafeAreaView, Button, Divider, InlineInput} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import useBroadcastTx from "../hooks/useBroadcastTx";
import {DesmosProfile, MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";
import {ProfileHeader} from "../components/ProfileHeader";
import {View} from "react-native";
import {FlexPadding} from "../components/FlexPadding";
import useSaveProfile from "../hooks/useSaveProfile";

type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "EditProfile">,
    StackScreenProps<RootStackParams>>;

export const EditProfile: React.FC<Props> = (props) => {
    const {profile, account} = props.route.params;
    const styles = useStyles();
    const {t} = useTranslation();
    const saveProfile = useSaveProfile()
    const broadcastTx = useBroadcastTx();
    const [dtag, setDtag] = useState(profile?.dtag ?? "");
    const [nickname, setNickname] = useState(profile?.nickname ?? "");
    const [bio, setBio] = useState(profile?.bio ?? "");
    const [profilePicture, setProfilePicture] = useState(profile?.profilePicture);
    const [coverPicture, setCoverPicture] = useState(profile?.coverPicture);

    const onSavePressed = async () => {
        try {
            const msg: MsgSaveProfileEncodeObject = {
                typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                value: {
                    creator: account.address,
                    dtag: dtag,
                    bio: bio,
                    nickname: nickname,
                    profilePicture: profilePicture,
                    coverPicture: coverPicture,
                }
            }
            await broadcastTx(account, [msg]);
            const newProfile: DesmosProfile = {
                address: account.address,
                dtag: dtag,
                bio: bio,
                nickname: nickname,
                profilePicture: profilePicture,
                coverPicture: coverPicture,
            }
            await saveProfile(newProfile);
            props.navigation.pop();
        } catch (e) {
            console.error(e);
        }
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
            profile={profile}
            onEditCoverPicture={onEditCoverPicture}
            onEditProfilePicture={onEditProfilePicture}
            hideDtag
            hideNickName
        />
        <View style={styles.content}>
            <InlineInput
                label={t("nickname")}
                placeholder={t("nickname")}
                value={nickname}
                onChangeText={setNickname}
            />
            <Divider />
            <InlineInput
                label="DTag"
                placeholder="DTag"
                value={dtag}
                onChangeText={setDtag}
            />
            <Divider />
            <InlineInput
                label={t("bio")}
                placeholder={t("bio")}
                multiline
                numberOfLines={12}
                value={bio}
                onChangeText={setBio}
            />
            <FlexPadding flex={1} />
            <Button
                style={styles.saveBtn}
                mode="contained"
                onPress={onSavePressed}
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
    input: {
    },
    saveBtn: {
        marginTop: theme.spacing.m
    }
}))