import React, {useMemo} from "react";
import {Any} from "cosmjs-types/google/protobuf/any";
import {View} from "react-native";
import {MsgSaveProfile} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile";
import {Divider, LabeledValue} from "../index";
import {useTranslation} from "react-i18next";
import {ProfileHeader} from "../ProfileHeader";
import {toHex} from "@cosmjs/encoding";
import {EncodeObject} from "@cosmjs/proto-signing";
import {MsgSaveProfileEncodeObject} from "@desmoslabs/sdk-core";

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

    const profilePicture = useMemo(() => {
        if (props.profilePicture?.indexOf("http://") === 0||
            props.profilePicture?.indexOf("https://") === 0) {
            return props.profilePicture;
        } else {
            return undefined;
        }
    }, [props.profilePicture])

    const coverPicture = useMemo(() => {
        if (props.coverPicture?.indexOf("http://") === 0||
            props.coverPicture?.indexOf("https://") === 0) {
            return props.coverPicture;
        } else {
            return undefined;
        }
    }, [props.coverPicture])

    return <View>
        <ProfileHeader
            profilePictureUri={profilePicture}
            coverPictureUri={coverPicture}
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
    value: string,
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
            value={props.value}
        />
    </View>
}

export type Props = {
    /**
     * The message to display.
     */
    message: Any | EncodeObject
}

export const TxMessage: React.FC<Props> = (props) => {

    const {typeUrl, value} = props.message;
    const isProtobuf = isProtobufMessage(props.message);

    if (typeUrl.endsWith("MsgSaveProfile")) {
        let props: SaveProfileMsgProps;
        if (isProtobuf) {
            const msgSaveProfile = MsgSaveProfile.decode(value);
            props = {
                typeUrl,
                profilePicture: msgSaveProfile.profilePicture,
                coverPicture: msgSaveProfile.coverPicture,
                dtag: msgSaveProfile.dtag,
                nickname: msgSaveProfile.nickname,
                bio: msgSaveProfile.bio,
            }
        } else {
            const encodeObjectValue: Partial<MsgSaveProfileEncodeObject["value"]> = value;
            props = {
                typeUrl,
                profilePicture: encodeObjectValue.profilePicture,
                coverPicture: encodeObjectValue.coverPicture,
                dtag: encodeObjectValue.dtag,
                nickname: encodeObjectValue.nickname,
                bio: encodeObjectValue.bio,
            }
        }
        return <SaveProfileMsg {...props} />
    } else  {
        return <UnknownMessage
            typeUrl={typeUrl}
            value={isProtobuf ? toHex(value) : JSON.stringify(value)}
        />
    }

}

function isProtobufMessage(msg: EncodeObject | Any): boolean {
    return msg.value.constructor === Uint8Array;
}