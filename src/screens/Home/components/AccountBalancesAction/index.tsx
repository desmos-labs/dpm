import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Button from 'components/Button';
import useStyles from './useStyles';

export interface ListHeaderActionProps {
  /**
   * Value label.
   */
  label: string;
  /**
   * The value to be displayed.
   */
  value?: string;
  /**
   * If true this component will show some animations to inform
   * the user that the value is being loaded.
   */
  loading?: boolean;
  /**
   * Text of the button.
   */
  buttonText: string;
  /**
   * Action executed when the user press on the button.
   */
  onButtonPressed?: () => any;
  /**
   * If true the button will have the theme accent color.
   */
  buttonAccent?: boolean;
  /**
   * Custom button color, this will override the `buttonAccent` prop if it's
   * true.
   */
  buttonColor?: string;
}

/**
 * Component that shows a value with a label that explains its meaning
 * and a button to perform an action related to the value displayed.
 */
const AccountBalancesAction: React.FC<ListHeaderActionProps> = ({
  label,
  value,
  loading,
  buttonText,
  onButtonPressed,
  buttonAccent,
  buttonColor,
}) => {
  const styles = useStyles();

  return (
    <View style={styles.actionContainer}>
      <View style={styles.actionValues}>
        <Typography.Subtitle2>{label}</Typography.Subtitle2>
        {loading ? (
          <TypographyContentLoaders.Subtitle2 width={200} />
        ) : (
          <Typography.Subtitle2>{value}</Typography.Subtitle2>
        )}
      </View>
      <Button
        style={styles.button}
        mode={'contained'}
        accent={buttonAccent}
        color={buttonColor}
        onPress={onButtonPressed}
      >
        {buttonText}
      </Button>
    </View>
  );
};

export default AccountBalancesAction;
