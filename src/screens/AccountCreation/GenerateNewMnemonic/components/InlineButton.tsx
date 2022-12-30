import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { makeStyle } from '../../../../theming';
import { Button } from '../../../../components';

export type ButtonAction = {
  label: string;
  onPress: () => void;
};

export type InlineButtonsProps = {
  buttons: ButtonAction[];
  selected?: number;
};

export const InlineButton: React.FC<InlineButtonsProps> = (props) => {
  const { buttons, selected } = props;
  const styles = useStyles();
  const [buttonSelected, setButtonSelected] = useState(selected ?? 0);

  const renderButtons = useCallback(
    (action: ButtonAction, index: number) => {
      const onPress =
        index === buttonSelected
          ? undefined
          : () => {
              setButtonSelected(index);
              action.onPress();
            };

      return (
        <Button
          key={`btn-${index}`}
          style={[styles.button, buttonSelected === index ? styles.selected : null]}
          labelStyle={[styles.label, buttonSelected === index ? null : styles.selectedLabel]}
          contentStyle={styles.contentStyle}
          mode="contained"
          onPress={onPress}
        >
          {action.label}
        </Button>
      );
    },
    [
      buttonSelected,
      styles.button,
      styles.selected,
      styles.label,
      styles.selectedLabel,
      styles.contentStyle,
    ]
  );

  const buttonsItems = useMemo(() => buttons.map(renderButtons), [renderButtons, buttons]);

  return <View style={styles.root}>{buttonsItems}</View>;
};

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
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
    color: theme.colors.font['3'],
  },
}));
