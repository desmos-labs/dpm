import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import Button from 'components/Button';
import useStyles from './useStyles';

export type ButtonAction = {
  label: string;
  onPress: () => void;
};

export type InlineButtonsProps = {
  buttons: ButtonAction[];
  selected?: number;
};

const InlineButton: React.FC<InlineButtonsProps> = (props) => {
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
    ],
  );

  const buttonsItems = useMemo(() => buttons.map(renderButtons), [renderButtons, buttons]);

  return <View style={styles.root}>{buttonsItems}</View>;
};

export default InlineButton;
