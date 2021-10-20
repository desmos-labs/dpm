import React, {useState} from "react";
import {TextInput, Props as TextInputProps} from "./TextInput";
import {useTheme} from "react-native-paper";
import {IconButton} from "./IconButton";



export const SecureTextInput: React.FC<TextInputProps> = (props) => {
    const theme = useTheme();
    const [hideText, setHideText] = useState(true)

    return <TextInput
        {...props}
        secureTextEntry={hideText}
        textAlignVertical="center"
        rightElement={<IconButton
            icon={hideText ? "eye-off-outline" : "eye-outline"}
            color={theme.colors.icon}
            onPress={() => {
                setHideText((old) => !old);
            }}/>}
    />
}