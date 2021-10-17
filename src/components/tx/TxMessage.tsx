import React from "react";
import {Any} from "cosmjs-types/google/protobuf/any";
import {View} from "react-native";
import {MsgSaveProfile} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import {ProfileHeader} from "../ProfileHeader";
import {toHex} from "@cosmjs/encoding";

export type SaveProfileMsgProps = {
    typeUrl: string,
    profilePicture?: string,
    coverPicture?: string,
    dtag?: string,
    nickname?: string,
    bio?: string,
}

export const SaveProfileMsg: React.FC<SaveProfileMsgProps> = (props) => {
    const {t} = useTranslation();

    return <View>
        <Divider />
        <ProfileHeader
            profilePictureUri={props.profilePicture}
            coverPictureUri={props.coverPicture}
        />
        <LabeledValue
            label={t("dtag")}
            value={props.dtag}
        />
        <Divider />
        <LabeledValue
            label={t("nickname")}
            value={props.nickname}
        />
        <Divider />
        <LabeledValue
            label={t("bio")}
            value={props.bio}
        />
    </View>
}

export type UnknownMessageProps = {
    typeUrl: string,
    value: Uint8Array,
}

export const UnknownMessage: React.FC<UnknownMessageProps> = (props) => {
    const {t} = useTranslation();

    return <View>
        <LabeledValue
            label={t("Message Type")}
            value={props.typeUrl}
        />
        <Divider />
        <LabeledValue
            label={t("Message Value")}
            value={toHex(props.value)}
        />
    </View>
}

export type Props = {
    /**
     * The message to display.
     */
    message: Any
}

export const TxMessage: React.FC<Props> = (props) => {

    const {typeUrl, value} = props.message;

    if (typeUrl.endsWith("MsgSaveProfile")) {
        const msgSaveProfile = MsgSaveProfile.decode(value);
        return <SaveProfileMsg {...msgSaveProfile} typeUrl={typeUrl}/>
    } else  {
        return <UnknownMessage {...props.message} />
    }

}
