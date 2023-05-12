import React from 'react';
import { Linking, View } from 'react-native';
import Typography from 'components/Typography';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';

export interface ValidatorInfoFieldProps {
  label: string;
  value: string;
  extraInfo?: string;
  loading?: boolean;
}

const ValidatorInfoField: React.FC<ValidatorInfoFieldProps> = ({
  label,
  value,
  extraInfo,
  loading,
}) => {
  const styles = useStyles();

  const url = React.useMemo(() => {
    try {
      // eslint-disable-next-line no-new
      return new URL(value);
    } catch (e) {
      return undefined;
    }
  }, [value]);

  const valueText = React.useMemo(() => {
    if (url) {
      // If the value is a valid url just the display the url without the protocol.
      return value.replace(`${url.protocol}//`, '');
    }

    return value;
  }, [value, url]);

  const onValuePressed = React.useCallback(() => {
    if (url !== undefined) {
      Linking.openURL(value);
    }
  }, [url, value]);

  return (
    <View style={styles.root}>
      <Typography.Body style={styles.label}>{label}</Typography.Body>
      {loading ? (
        <StyledActivityIndicator />
      ) : (
        <View style={styles.valueContainer}>
          {extraInfo !== undefined && (
            <Typography.Caption style={styles.extraInfo}>{extraInfo}</Typography.Caption>
          )}
          <Typography.Body style={url ? styles.url : undefined} onPress={onValuePressed}>
            {valueText}
          </Typography.Body>
        </View>
      )}
    </View>
  );
};

export default ValidatorInfoField;
