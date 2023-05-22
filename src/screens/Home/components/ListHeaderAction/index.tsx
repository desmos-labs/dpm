import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Button from 'components/Button';
import useStyles from './useStyles';

export interface ListHeaderActionProps {
  label: string;
  value?: string;
  loading?: boolean;
  buttonText: string;
  onButtonPressed?: () => any;
  buttonAccent?: boolean;
  buttonColor?: string;
}

const ListHeaderAction: React.FC<ListHeaderActionProps> = ({
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

export default ListHeaderAction;
