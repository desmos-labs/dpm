import React from "react";
import {Image, View} from "react-native";
import {makeStyle} from "../../../theming";
import {format} from "date-fns";
import {EncodeObject} from "@cosmjs/proto-signing";
import {Typography} from "../../typography";
import {MsgTypes} from "../../../types/msgtypes";

export type Props = {
    encodeObject: EncodeObject,
    date: Date,
    renderContent: () => React.ReactNode,
}

function msgTypeToIcon(typeUrl: string) {
    switch (typeUrl) {
        case MsgTypes.MsgSend:
            return require("../../../assets/tx-icons/send.png");

        case MsgTypes.MsgSaveProfile:
            return require("../../../assets/tx-icons/general.png");

        default:
            return require("../../../assets/tx-icons/general-1.png");
    }
}

export const BaseMessageListItem: React.FC<Props> = (props) => {
    const {encodeObject, date} = props;
    const styles = useStyles()

    return <View style={styles.root}>
        <View>
            <Image
                style={styles.image}
                source={msgTypeToIcon(encodeObject.typeUrl)}
                resizeMode="contain"
            />
        </View>
        <View style={styles.content}>
            {props.renderContent()}
            <Typography.Caption style={styles.date}>
                {format(date, "dd MMM, HH:mm")}
            </Typography.Caption>
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.colors.background,
    },
    image: {
        marginTop: 6,
        width: 34,
        height: 34,
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    date: {
        marginTop: 11,
        color: "#9d9d9d",
    }
}))