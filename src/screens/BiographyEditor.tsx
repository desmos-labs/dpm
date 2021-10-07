import React, {useCallback, useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {Button, StyledSafeAreaView, TopBar} from "../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {StyleProp, StyleSheet, Text, TextInput, TextStyle} from "react-native";

export type Props = StackScreenProps<AccountScreensStackParams, "BiographyEditor">

const MAX_BIO_LENGTH = 1000;

export const BiographyEditor: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const {navigation} = props;
    const styles = useStyles();
    const [bio, setBio] = useState(props.route.params.bio ?? "");
    const [charCount, setCharCount] = useState(MAX_BIO_LENGTH - bio.length);
    const charCountWarning = charCount <= 20;

    const onDonePressed = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                bio,
            },
            merge: true
        })
    }, [navigation, bio]);

    const onTextChange = useCallback((text: string) => {
        const allowedChars = MAX_BIO_LENGTH - text.length;
        if (allowedChars >= 0) {
            setBio(text);
            setCharCount(allowedChars);
        } else {
            setBio(_ => text.substring(0, MAX_BIO_LENGTH));
            setCharCount(0);
        }
    }, [setBio]);

    const charCountStyle = useMemo(() => {
        if (charCountWarning) {
            return StyleSheet.compose(styles.charCount as StyleProp<TextStyle>, styles.charCountWarning)
        } else {
            return styles.charCount
        }
    }, [styles, charCountWarning])

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={props}
            title={t("bio")}
            rightElement={<Button
                mode="text"
                onPress={onDonePressed}
            >
                {t("done")}
            </Button>}
        />}
        divider
    >
        <TextInput
            value={bio}
            style={styles.input}
            multiline={true}
            onChangeText={onTextChange}
        />
        <Text
            style={charCountStyle}
        >
            {charCount}
        </Text>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    input: {
        flexGrow: 1,
        textAlignVertical: "top",
    },
    charCount: {
        alignSelf: "flex-end",
        color: "black",
        right: 0,
    },
    charCountWarning: {
        color: theme.colors.primary
    }
}))