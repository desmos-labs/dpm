import React from "react";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";

export type Props = {
    /**
     * Flex value used to generate the padding area.
     */
    flex: number,

    onPress?: () => void,
}

export const FlexPadding: React.FC<Props> = ({flex, onPress}) => {
    const style = StyleSheet.create({
        padding: {
            flex,
        }
    })
    return <TouchableWithoutFeedback
        style={style.padding}
        onPress={onPress}>
        <View style={style.padding}/>
    </TouchableWithoutFeedback>
}