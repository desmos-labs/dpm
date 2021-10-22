import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import {ProfileHeader} from "../ProfileHeader";
import {LabeledValue} from "../LabeledValue";
import {Divider} from "../Divider";
import {MsgSaveProfile} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile";
import {MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";

export type SaveProfileMessageProps = {
    protobufObject?: MsgSaveProfile,
    encodeObject?: MsgSaveProfileEncodeObject["value"]
}

export const SaveProfileMessage: React.FC<SaveProfileMessageProps> = ({protobufObject, encodeObject}) => {
    const {t} = useTranslation();

    const profilePicture = useMemo(() => {
        const profilePicture = protobufObject?.profilePicture ?? encodeObject?.profilePicture
        if (profilePicture?.indexOf("http://") === 0||
            profilePicture?.indexOf("https://") === 0) {
            return profilePicture;
        } else {
            return undefined;
        }
    }, [encodeObject?.profilePicture, protobufObject?.profilePicture]);

    const coverPicture = useMemo(() => {
        const coverPicture = protobufObject?.coverPicture ?? encodeObject?.coverPicture

        if (coverPicture?.indexOf("http://") === 0||
            coverPicture?.indexOf("https://") === 0) {
            return coverPicture;
        } else {
            return undefined;
        }
    }, [encodeObject?.coverPicture, protobufObject?.coverPicture]);

    return <View>
        <ProfileHeader
            profilePictureUri={profilePicture}
            coverPictureUri={coverPicture}
        />
        <LabeledValue
            label={t("dtag")}
            value={protobufObject?.dtag ?? encodeObject?.dtag}
        />
        <Divider />
        <LabeledValue
            label={t("nickname")}
            value={protobufObject?.nickname ?? encodeObject?.nickname}
        />
        <Divider />
        <LabeledValue
            label={t("bio")}
            value={protobufObject?.bio ?? encodeObject?.bio}
        />
    </View>
}