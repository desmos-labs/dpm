import { failIcon, successIcon } from 'assets/images';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

interface DTagAvailabilityProps {
  readonly loading: boolean;
  readonly isAvailable: boolean | undefined;
}

/**
 * Component that provides a feedback to the user about the availability of
 * their DTag when they are editing their profile.
 */
const DTagAvailability: React.FC<DTagAvailabilityProps> = ({ loading, isAvailable }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const availability = React.useMemo(() => {
    if (loading) {
      return <StyledActivityIndicator />;
    }
    if (isAvailable === undefined) {
      return null;
    }

    if (isAvailable) {
      return (
        <View style={styles.root}>
          <Image style={styles.statusIcon} source={successIcon} />
          <Typography.Regular14 style={styles.availableText}>{t('available')}</Typography.Regular14>
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <Image style={styles.statusIcon} source={failIcon} />
        <Typography.Regular14 style={styles.notAvailableText}>
          {t('not available')}
        </Typography.Regular14>
      </View>
    );
  }, [
    loading,
    isAvailable,
    styles.root,
    styles.statusIcon,
    styles.notAvailableText,
    styles.availableText,
    t,
  ]);

  return <View style={styles.root}>{availability}</View>;
};

export default DTagAvailability;

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  statusIcon: {
    width: 24,
    height: 24,
    marginRight: theme.spacing.s,
  },
  availableText: {
    color: theme.colors.feedbackSuccess,
  },
  notAvailableText: {
    color: theme.colors.feedbackError,
  },
}));
