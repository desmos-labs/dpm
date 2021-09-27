import React, {useState} from "react";
import {makeStyle} from "../theming";
import {View, Text, StyleProp, ViewStyle, StyleSheet} from "react-native";
import {HdPath} from "../types/hdpath";
import {TextInput} from "./TextInput";

export type Props = {
    /**
     * Function called when the HDPath changes.
     */
    onChange?: (path: HdPath) => void,
    style?: StyleProp<ViewStyle>,
}

const safeParseInt = (value: string) => {
    const number = parseInt(value);
    if (isNaN(number)) {
        return 0;
    } else {
        return number;
    }
}

export const HdPathPicker: React.FC<Props> = (props) => {
    const classes = useStyle();
    const [hdPath, setHdPath] = useState<HdPath>({
        account: 0,
        change: 0,
        addressIndex: 0,
    })

    const onElementChange = (value: string, element: keyof HdPath) => {
        let newHdPath = hdPath;
        switch (element) {
            case "account":
                newHdPath = {
                    ...hdPath,
                    account: safeParseInt(value)
                }
                break;
            case "change":
                newHdPath = {
                    ...hdPath,
                    change: safeParseInt(value),
                }
                break;
            case "addressIndex":
                newHdPath = {
                    ...hdPath,
                    addressIndex: safeParseInt(value),
                }
                break;
        }
        setHdPath(newHdPath);
        if (props.onChange !== undefined) {
            props.onChange(newHdPath);
        }
    }

    return <View
        style={StyleSheet.compose(classes.root as StyleProp<ViewStyle>, props.style)}
    >
        <Text
            style={classes.hdPathText}
        >
            m/44'/852'/
        </Text>
        <TextInput
            style={classes.elements}
            inputStyle={classes.input}
            keyboardType="numeric"
            onChangeText={v => onElementChange(v, "account")}
            value={hdPath.account.toString()}
        />
        <Text
            style={classes.hdPathText}
        >
           /
        </Text>
        <TextInput
            style={classes.elements}
            inputStyle={classes.input}
            keyboardType="numeric"
            onChangeText={v => onElementChange(v, "change")}
            value={hdPath.change.toString()}
        />
        <Text
            style={classes.hdPathText}
        >
            /
        </Text>
        <TextInput
            style={classes.elements}
            inputStyle={classes.input}
            keyboardType="numeric"
            onChangeText={v => onElementChange(v, "addressIndex")}
            value={hdPath.addressIndex.toString()}
        />
    </View>
}

const useStyle = makeStyle(_theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    elements: {
        maxWidth: 80,
        flexGrow: 1,
    },
    input: {
        textAlignVertical: "center",
    },
    hdPathText: {
        fontFamily: "SF-Pro-Text",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
    }
}))