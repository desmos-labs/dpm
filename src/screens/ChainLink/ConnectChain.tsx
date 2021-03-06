import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageSourcePropType, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { DpmImage, StyledSafeAreaView, TopBar } from '../../components';
import { DpmImages } from '../../components/DpmImage';
import { makeStyle } from '../../theming';
import { ChainLinkScreensStackParams, ImportMode } from '../../types/navigation';
import { Typography } from '../../components/typography';

export type Props = StackScreenProps<ChainLinkScreensStackParams, 'ConnectChain'>;

export const ConnectChain: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const styles = useStyle();
  const { backAction, feeGranter } = route.params;

  const connectWithMnemonic = useCallback(() => {
    navigation.navigate({
      name: 'SelectChain',
      params: {
        importMode: ImportMode.Mnemonic,
        backAction,
        feeGranter,
      },
    });
  }, [navigation, backAction, feeGranter]);

  const connectWithLedger = useCallback(() => {
    navigation.navigate({
      name: 'SelectChain',
      params: {
        importMode: ImportMode.Ledger,
        backAction,
      },
    });
  }, [navigation, backAction]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('connect chain')} />
      }
    >
      <Typography.Body>{t('select connection method')}</Typography.Body>

      <ImageButton
        style={styles.topMargin}
        image="connect-mnemonic"
        label={t('use secret recovery passphrase')}
        onPress={connectWithMnemonic}
      />

      <ImageButton
        style={[styles.topMargin]}
        image="connect-ledger"
        label={t('connect with ledger')}
        onPress={connectWithLedger}
      />
    </StyledSafeAreaView>
  );
};

const useStyle = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  topMargin: {
    marginTop: theme.spacing.l,
  },
}));

type ImageButtonProps = {
  image: ImageSourcePropType | DpmImages;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ImageButton: React.FC<ImageButtonProps> = ({ image, label, onPress, disabled, style }) => {
  const styles = useImageButtonStyles();

  return (
    <TouchableOpacity style={[styles.root, style]} onPress={onPress} disabled={disabled}>
      <DpmImage source={image} />
      <Typography.Body1>{label}</Typography.Body1>
    </TouchableOpacity>
  );
};

const useImageButtonStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface2,
  },
}));
