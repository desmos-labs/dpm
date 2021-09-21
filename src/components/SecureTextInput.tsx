import React, {useState} from "react";
import {TextInput} from "react-native-paper";
import {StyleProp, TextStyle} from "react-native";

export type Props = {
    /**
     * Mode of the TextInput.
     * - `flat` - flat input with an underline.
     * - `outlined` - input with an outline.
     */
    mode?: 'flat' | 'outlined'
    /**
     * The text to use for the floating label.
     */
    label?: string
    /**
     * The value that the inout should have
     */
    value?: string
    /**
     * Function called when the text changes.
     * @param text - The new input text.
     */
    onChangeText?: (text: string) => void
    /**
     * Whether to style the input with error style.
     */
    error?: boolean
    /**
     * If true, user won't be able to interact with the component.
     */
    disabled?: boolean
    style?: StyleProp<TextStyle>
}

export const SecureTextInput: React.FC<Props> = (props) => {
    const [hideText, setHideText] = useState(true)

    return <TextInput
        mode={props.mode}
        style={props.style}
        label={props.label}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={hideText}
        error={props.error}
        disabled={props.disabled}
        right={<TextInput.Icon
            name={hideText ? "eye-outline" : "eye-off-outline"}
            onPress={() => {
                setHideText((old) => !old);
            }}/>}
    />
}