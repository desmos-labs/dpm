import React, {useState} from "react";
import {StyleProp, TextStyle} from "react-native";
import {TextInput} from "react-native-paper";
import {EnglishMnemonic} from "@cosmjs/crypto";
import Clipboard from "@react-native-community/clipboard";

export type Props = {
    /**
     * The mnemonic to display.
     */
    mnemonic?: string,
    /**
     * True if the mnemonic can be edited from the user.
     */
    editable?: boolean
    /**
     * True to display a button to copy the mnemonic.
     */
    copyBtn?: boolean
    /**
     * Function called when the mnemonic changes.
     * @param mnemonic - The new mnemonic value.
     * @param wordsCount - The number of words in the current mnemonic.
     * @param invalidWords - The invalid word present in the mnemonic.
     */
    onChange?: (mnemonic: string, wordsCount: number, invalidWords: string[]) => void,
    /**
     * Callback that is called when the text input's submit button is pressed.
     */
    onSubmitEditing?: () => void,
    style?: StyleProp<TextStyle>,
}

export const MnemonicViewer: React.FC<Props> = (props) => {
    const [mnemonic, setMnemonic] = useState(props.mnemonic);

    const onMnemonicChange = (newMnemonic: string) => {
        const mnemonicLength = newMnemonic.length;
        if (mnemonicLength > 2 &&
            newMnemonic[mnemonicLength - 1] === " " &&
            newMnemonic[mnemonicLength - 2] === " ") {
            setMnemonic(newMnemonic.slice(0, -1));
            return;
        }

        setMnemonic(newMnemonic);
        if (props.onChange !== undefined) {
            const words = newMnemonic.split(" ");
            const invalidWords = words.filter(w => w.length > 0 && EnglishMnemonic.wordlist.indexOf(w) === -1);
            props.onChange(newMnemonic, words.length, invalidWords);
        }
    }

    return <TextInput
        style={props.style}
        mode="outlined"
        multiline
        value={mnemonic}
        editable={props.editable}
        numberOfLines={4}
        onChangeText={onMnemonicChange}
        onSubmitEditing={props.onSubmitEditing}
        defaultValue={mnemonic}
        right={props.copyBtn && <TextInput.Icon
            onPress={() => {
                Clipboard.setString(mnemonic ?? "");
            }}
            name={"content-copy"}
        />}
    />
}