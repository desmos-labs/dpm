import React, {useEffect, useState} from "react";
import {Image, View} from "react-native";
import {Avatar, Caption, IconButton, Subheading, Surface} from "react-native-paper";
import {cropAddress} from "../utilils/address";
import Clipboard from "@react-native-community/clipboard";
import {makeStyle} from "../theming";
import ChainAccount from "../types/chainAccount";
import {useDesmosClient} from "@desmoslabs/sdk-react";
import {DesmosProfile} from "@desmoslabs/sdk-core";

export type Props = {
    account: ChainAccount,
    openProfileEdit?: () => void,
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    coverPicture: {
        width: '100%',
        height: 200,
    },
    detailsContainer: {
        marginTop: -60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.s,
    },
    details: {
        display: "flex",
        flexDirection: "column",
        marginLeft: theme.spacing.s,
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.roundness * 3,
        elevation: 12
    },
    detailsRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        flexGrow: 1,
    },
    username: {
        color: '#ffffff',
        flexGrow: 1,
    },
    dtag: {
        color: '#dfdfdf',
    },
    address: {
        color: '#dfdfdf',
        flexGrow: 1
    },
}))

export const ProfileHeader: React.FC<Props> = (props) => {
    const {account} = props;

    const styles = useStyles();
    const client = useDesmosClient();
    const [userProfile, setUserProfile] = useState<null | DesmosProfile>(null);

    useEffect(() => {
        (async () => {
            try {
                await client.connect();
                const profile = await client.getProfile(account.address);
                client.disconnect();
                setUserProfile(profile);
            } catch (e) {
                console.error(e);
            }
        })()
    }, [client, account.address]);

    const profilePicture = userProfile?.profilePicture ? <Avatar.Image
        size={120}
        source={{
            uri: userProfile?.profilePicture
        }}
    /> : <Avatar.Icon size={120} icon="account"/>;

    const coverPicture = userProfile?.coverPicture ? {
        uri: userProfile?.coverPicture
    } : require("../assets/splashscreen_background.png");

    return <Surface
        style={styles.root}
    >
        <Image
            style={styles.coverPicture}
            resizeMode="cover"
            source={coverPicture}
        />
        <View
            style={styles.detailsContainer}
        >
            {profilePicture}
            <Surface
                style={styles.details}
            >
                <View
                    style={styles.detailsRow}
                >
                    <Subheading
                        style={styles.username}
                    >
                        {userProfile?.nickname ?? cropAddress(account.address, 4)}
                    </Subheading>
                    <IconButton
                        icon="pencil"
                        color={"#dfdfdf"}
                        onPress={props.openProfileEdit}
                        size={16}
                    />
                </View>
                {userProfile?.dtag && <Caption
                    style={styles.dtag}
                >
                    {`@${userProfile?.dtag}`}
                </Caption>
                }
                <View
                    style={styles.detailsRow}
                >
                    <Caption
                        style={styles.address}
                    >
                        {cropAddress(account.address, 6)}
                    </Caption>
                    <IconButton
                        icon="content-copy"
                        size={16}
                        color={"#fff"}
                        onPress={() => Clipboard.setString(account.address)}
                    />
                </View>
            </Surface>
        </View>
    </Surface>
}
