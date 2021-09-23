import React from "react";
import {StyleSheet, View} from "react-native";

export type Props = {
    /**
     * Flex value used to generate the padding area.
     */
    flex: number,
}

export const FlexPadding: React.FC<Props> = ({flex}) => {
    const style = StyleSheet.create({
        padding: {
            flex,
        }
    })
    return <View style={style.padding}/>
}