import React from "react";
import {Image, View} from "react-native";
import {Avatar, Caption, IconButton, Subheading, Surface} from "react-native-paper";
import {cropAddress} from "../utilils/address";
import Clipboard from "@react-native-community/clipboard";
import {makeStyle} from "../theming";
import ChainAccount from "../types/chainAccount";

export type Props = {
    account: ChainAccount,
    openProfileEdit?: () => void,
}

const useStyeles = makeStyle(theme => ({
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
    const classes = useStyeles();
    const {account} = props;

    const profilePicture = {
        uri: 'https://c.tenor.com/acihnolEVYAAAAAC/goku-hi.gif'
    }
    const coverPicture = {
        uri: 'https://c.tenor.com/CzMleGr4mqYAAAAC/shenron-dragon-ball.gif'
    }

    return <Surface
        style={classes.root}
    >
        <Image
            style={classes.coverPicture}
            resizeMode="cover"
            source={coverPicture}
        />
        <View
            style={classes.detailsContainer}
        >
            <Avatar.Image
                size={120}
                source={profilePicture}
            >
            </Avatar.Image>
            <Surface
                style={classes.details}
            >
                <View
                    style={classes.detailsRow}
                >
                    <Subheading
                        style={classes.username}
                    >
                        Username
                    </Subheading>
                    <IconButton
                        icon="pencil"
                        color={"#dfdfdf"}
                        onPress={props.openProfileEdit}
                        size={16}
                    />
                </View>
                <Caption
                    style={classes.dtag}
                >
                    @dtag
                </Caption>
                <View
                    style={classes.detailsRow}
                >
                    <Caption
                        style={classes.address}
                    >
                        {cropAddress(account.address, 6)}
                    </Caption>
                    <IconButton
                        icon="content-copy"
                        size={16}
                        color={"#fff"}
                        onPress={() => Clipboard.setString(account.address)}
                    />
                    <IconButton
                        icon="share-variant"
                        size={16}
                        color={"#fff"}
                        onPress={() => Clipboard.setString(account.address)}
                    />
                </View>
            </Surface>
        </View>
    </Surface>
}
