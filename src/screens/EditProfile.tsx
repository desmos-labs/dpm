import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {StyledSafeAreaView, Button} from "../components";
import {TextInput} from "react-native-paper";
import {CompositeScreenProps} from "@react-navigation/native";
import useBroadcastTx from "../hooks/useBroadcastTx";
import {MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";

const useStyles = makeStyle(theme => ({
    input: {
        marginTop: theme.spacing.s,
    },
    saveBtn: {
        marginTop: theme.spacing.m
    }
}))

type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "EditProfile">,
    StackScreenProps<RootStackParams>>;


export const EditProfile: React.FC<Props> = (props) => {
    const styles = useStyles();
    const {t} = useTranslation();
    const {currentProfile, account} = props.route.params;
    const broadcastTx = useBroadcastTx();
    const [dtag, setDtag] = useState(currentProfile?.dtag ?? "");
    const [nickname, setNickname] = useState(currentProfile?.nickname ?? "");
    const [bio, setBio] = useState(currentProfile?.bio ?? "");
    const [profilePicture, setProfilePicture] = useState(currentProfile?.profilePicture ?? "");
    const [coverPicture, setCoverPicture] = useState(currentProfile?.coverPicture ?? "");

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
            props.navigation.pop();
        } catch (e) {
            console.error(e);
        }
    }

    return <StyledSafeAreaView scrollable>
        <TextInput
            label={t("dtag")}
            mode="outlined"
            value={dtag}
            onChangeText={setDtag}
        />
        <TextInput
            style={styles.input}
            mode="outlined"
            label={t("nickname")}
            value={nickname}
            onChangeText={setNickname}
        />
        <TextInput
            style={styles.input}
            mode="outlined"
            label={t("bio")}
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
        />
        <TextInput
            style={styles.input}
            mode="outlined"
            label={t("profile picture")}
            value={profilePicture}
            onChangeText={setProfilePicture}
        />
        <TextInput
            style={styles.input}
            mode="outlined"
            label={t("cover picture")}
            value={coverPicture}
            onChangeText={setCoverPicture}
        />
        <Button
            style={styles.saveBtn}
            mode="contained"
            onPress={onSavePressed}
        >
            {t("save")}
        </Button>
    </StyledSafeAreaView>
}