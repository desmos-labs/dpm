import React, {useCallback, useMemo, useState} from "react";
import {makeStyle} from "../theming";
import {View} from "react-native";
import {Button} from "./Button";

export type ButtonAction = {
    label: string,
    onPress: () => void,
}

export type Props = {
    buttons: ButtonAction[],
    selected?: number
}

export const InlineButtons: React.FC<Props> = (props) => {
    const {buttons} = props;
    const styles = useStyles();
    const [selected, setSelected] = useState(props.selected ?? 0);

    const renderButtons = useCallback((action: ButtonAction, index: number) => {
        const onPress = index === selected ? undefined : () => {
            setSelected(index);
            action.onPress();
        }

        return <Button
            key={`btn-${index}`}
            style={[styles.button, selected === index ? styles.selected : null]}
            labelStyle={[styles.label, selected === index ? null : styles.selectedLabel]}
            contentStyle={styles.contentStyle}
            mode="contained"
            onPress={onPress}
        >
            {action.label}
        </Button>
    }, [selected, styles.button, styles.selected, styles.label, styles.selectedLabel, styles.contentStyle]);

    const buttonsItems = useMemo(() => {
        return buttons.map(renderButtons);
    }, [renderButtons, buttons])

    return <View style={styles.root}>
        {buttonsItems}
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
    },
    button: {
        flex: 1,
        backgroundColor: 'rgba(237, 108, 83, 0.1)',
    },
    label: {
        fontSize: 14,
    },
    contentStyle: {
        height: 38,
    },
    selected: {
        backgroundColor: theme.colors.primary,
    },
    selectedLabel: {
        color: theme.colors.font["3"],
    }
}))