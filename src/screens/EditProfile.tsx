import React, {useCallback, useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {StyledSafeAreaView, Button, Divider, InlineInput, InlineLabeledValue} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {ProfileHeader} from "../components/ProfileHeader";
import {ScrollView} from "react-native";
import {launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from "react-native-image-picker/src/types";
import {TopBar} from "../components";
import {DesmosProfile} from "@desmoslabs/sdk-core";

type Props = CompositeScreenProps<StackScreenProps<AccountScreensStackParams, "EditProfile">,
    StackScreenProps<RootStackParams>>;

export const EditProfile: React.FC<Props> = (props) => {
    const account = props.route.params.account!;
    const profile = props.route.params.profile;
    const styles = useStyles();
    const {t} = useTranslation();
    const [dtag, setDtag] = useState(profile?.dtag ?? "");
    const [nickname, setNickname] = useState(profile?.nickname);
    const [bio, setBio] = useState(profile?.bio);
    const [selectedProfilePicture, setProfilePicture] = useState<string | undefined>(undefined);
    const [selectedCoverPicture, setCoverPicture] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (props.route.params.bio !== undefined) {
            setBio(props.route.params.bio);
        }
    }, [props.route.params.bio]);

    const onSavePressed = () => {
        props.navigation.navigate({
            name: "ConfirmProfileEdit",
            params: {
                account: account,
                profile: {
                    ...profile,
                    address: account.address,
                    dtag,
                    nickname,
                    bio,
                } as DesmosProfile,
                localCoverPictureUri: selectedCoverPicture,
                localProfilePictureUri: selectedProfilePicture,
                goBackTo: props.route.params.goBackTo,
                feeGranter: props.route.params.feeGranter,
            }
        });
    }

    const pickPicture = useCallback((setter: (value: string | undefined) => void) => {
        launchImageLibrary({
            quality: 1,
            mediaType: "photo",
            selectionLimit: 1,
            includeBase64: false
        }, ((response: ImagePickerResponse) => {
            const assets = response.assets ?? [];
            if (assets.length > 0) {
                setter(assets[0].uri)
            }
        }))
    }, [])

    const onEditCoverPicture = useCallback(() => {
        pickPicture(setCoverPicture);
    }, [pickPicture]);

    const onEditProfilePicture = useCallback(() => {
        pickPicture(setProfilePicture);
    }, [pickPicture]);

    const openBiographyEditor = useCallback(() => {
        props.navigation.navigate({
            name: "BiographyEditor",
            params: {
                bio
            }
        })
    }, [bio, props.navigation]);

    return <StyledSafeAreaView
        padding={0}
        topBar={<TopBar
            stackProps={props}
            title={profile !== null ? t("edit profile") : t("create profile")}
        />}
    >
        <ProfileHeader
            coverPictureUri={selectedCoverPicture ?? profile?.coverPicture}
            profilePictureUri={selectedProfilePicture ?? profile?.profilePicture}
            onEditCoverPicture={onEditCoverPicture}
            onEditProfilePicture={onEditProfilePicture}
        />
        <ScrollView style={styles.content}>
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
            <InlineLabeledValue
                label={t("bio")}
                value={bio}
                onPress={openBiographyEditor}
            />
        </ScrollView>
        <Button
            style={styles.saveBtn}
            mode="contained"
            onPress={onSavePressed}
            disabled={dtag.length === 0}
        >
            {t("next")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
    },
    input: {},
    saveBtn: {
        margin: theme.spacing.m,
    },
}))