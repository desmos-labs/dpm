import React from 'react';
import { Linking, View } from 'react-native';
import Typography from 'components/Typography';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';

export interface ValidatorInfoFieldProps {
  /**
   * Label that describe the displayed value.
   */
  label: string;
  /**
   * The value to be displayed. if this value is an url such as http://desmos.network
   * will be displayed using the theme primary color and when the user
   * clicks on it the application will navigate to the url.
   */
  value: string;
  /**
   * Extra information about the displayed value.
   */
  extraInfo?: string;
  /**
   * If true shows an activity indicator to tell the user that the value
   * is being computed.
   */
  loading?: boolean;
}

/**
 * Component to show some information of a validator.
 * This component will have a label that describe the showed value
 * the value to display and an extra info field to provide more information
 * about the displayed value.
 */
const ValidatorInfoField: React.FC<ValidatorInfoFieldProps> = ({
  label,
  value,
  extraInfo,
  loading,
}) => {
  const styles = useStyles();

  const url = React.useMemo(() => {
    try {
      // Check if the provided value is a url, if the value is an url
      // this component will show the value in a different way and
      // will allow the user to navigate to the url on press.
      // eslint-disable-next-line no-new
      return new URL(value);
    } catch (e) {
      return undefined;
    }
  }, [value]);

  const valueText = React.useMemo(() => {
    if (url) {
      // If the value is a valid url just the display the url without the protocol.
      const urlWithoutProtocol = value.replace(`${url.protocol}//`, '');
      return urlWithoutProtocol.endsWith('/')
        ? urlWithoutProtocol.slice(0, -1)
        : urlWithoutProtocol;
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
          <Typography.Body
            style={url ? styles.url : undefined}
            onPress={onValuePressed}
            ellipsizeMode={'tail'}
            numberOfLines={1}
          >
            {valueText}
          </Typography.Body>
        </View>
      )}
    </View>
  );
};

export default ValidatorInfoField;
