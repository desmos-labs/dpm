import React from "react";
import {Image, View, ImageProps} from "react-native";
import {Subtitle} from "../Subtitle";
import {Divider} from "../Divider";
import {LabeledValue} from "../LabeledValue";
import {makeStyle} from "../../theming";


export type Props = {
    icon: ImageProps["source"],
    iconSubtitle?: string,
    fields?: {label: string, value?: string}[],
}

export const SimpleMessageComponent: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <View>
        <View style={styles.txHeader}>
            <Image
                style={styles.txIcon}
                source={props.icon}
                resizeMode="contain"
            />
            <Subtitle
                style={styles.headerAmount}
                capitalize={false}>
                {props.iconSubtitle}
            </Subtitle>
        </View>
        {props.fields?.map((field, index) => {
            return <View key={`field-${index}`}>
                <Divider />
                <LabeledValue
                    label={field.label}
                    value={field.value}
                />
            </View>
        })}
    </View>
}

const useStyles = makeStyle(_ => ({
    txHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
    },
    txIcon: {
        width: 34,
        height: 34,
    },
    headerAmount: {
        marginTop: 10,
    }
}))