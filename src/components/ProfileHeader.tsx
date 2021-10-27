import React, {ReactNode, useMemo} from "react";
import {Image, Text, View} from "react-native";
import {IconButton} from "./IconButton";
import {makeStyle} from "../theming";
import {AvatarImage} from "./AvatarImage";

export type Props = {
    address?: string,
    dtag?: string,
    nickname?: string,
    coverPictureUri?: string,
    profilePictureUri?: string,
    topRightElement?: ReactNode | null
    topLeftElement?: ReactNode | null
    onCopyPressed?: () => void,
    onEditProfilePicture?: () => void,
    onEditCoverPicture?: () => void,
}

export const ProfileHeader: React.FC<Props> = (props) => {

    const styles = useStyles();
    const {address, dtag, nickname, coverPictureUri, profilePictureUri} = props;

    const coverPicture = useMemo(() => {
        return coverPictureUri ? {
            uri: coverPictureUri
        } : require("../assets/default-profile-cover-light.png");
    }, [coverPictureUri])

    const profilePicture = useMemo(() => {
        return profilePictureUri ? {
            uri: profilePictureUri
        } : require("../assets/default-profile-picture.png");
    }, [profilePictureUri]);

    return <View
        style={styles.root}
    >
        <View style={styles.topRight}>
            {props.topRightElement}
        </View>
        <View style={styles.topLeft}>
            {props.topLeftElement}
        </View>
        <View style={styles.coverPictureContainer}>
            <Image
                style={styles.coverPicture}
                resizeMode="stretch"
                source={coverPicture}
            />
            {props.onEditCoverPicture && <IconButton
                icon="camera-outline"
                size={20}
                color="#fff"
                onPress={props.onEditCoverPicture}
                style={styles.editCoverPictureBtn}
            />}
        </View>
        <View style={styles.profilePictureContainer}>
            <AvatarImage
                size={100}
                source={profilePicture}
            />
            {props.onEditProfilePicture && <IconButton
                icon="camera-outline"
                size={20}
                color="#fff"
                onPress={props.onEditProfilePicture}
                style={styles.editProfilePictureBtn}
            />}
        </View>

        {nickname && <Text style={styles.nickName}>{nickname}</Text>}
        {dtag && <Text style={styles.dtag}>@{dtag}</Text>}

        {props.address && <View style={styles.addressContainer}>
            <Text
                style={styles.address}
                ellipsizeMode="middle"
                numberOfLines={1}
            >
                {address}
            </Text>
            <View>
                <IconButton
                    icon="content-copy"
                    size={20}
                    onPress={props.onCopyPressed}
                />
            </View>
        </View>}
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
    },
    topRight: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0
    },
    topLeft: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0
    },
    coverPictureContainer: {
        width: '100%',
    },
    coverPicture: {
        width: "100%",
        height: 200,
    },
    editCoverPictureBtn: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: '#7a7a7a',
        padding: 2,
    },
    profilePictureContainer: {
        marginTop: -70,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editProfilePictureBtn: {
        position: "absolute",
        bottom: -10,
        right: -10,
        backgroundColor: '#7a7a7a',
        padding: 2,
    },
    nickName: {
        fontWeight: "500",
        fontSize: 22,
        lineHeight: 26,
        letterSpacing: 0.0015,
        color: theme.colors.primary,
        marginTop: 16,
    },
    dtag: {
        color: theme.colors.text,
        fontFamily: 'SF Pro Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 17,
        marginTop: 6,
    },
    addressContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 16,
        marginHorizontal: 32,
        alignItems: "center",
    },
    address: {
        color: theme.colors.text,
    },
}))
