import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLinkableChainInfoByName } from 'lib/ChainsUtils';
import { cosmosIcon } from 'assets/images';
import TopBar from 'components/TopBar';
import Spacer from 'components/Spacer';
import { ChainLink } from 'types/desmos';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';
import { useDisconnectChainLink } from './useHooks';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CHAIN_LINK_DETAILS>;

export interface ChainLinkDetailsParams {
  chainLink: ChainLink;
  canEdit: boolean;
}

const ChainLinkDetails = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const { chainLink, canEdit } = params;
  const { t } = useTranslation('chainLinks');

  const { chainIcon, chainName } = useMemo(() => {
    const chainInfo = getLinkableChainInfoByName(chainLink.chainName);
    return {
      chainIcon: chainInfo?.icon ?? cosmosIcon,
      chainName: chainInfo?.name ?? chainLink.chainName,
    };
  }, [chainLink.chainName]);

  const onChainDisconnected = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const disconnectChainLink = useDisconnectChainLink(chainLink, { onSuccess: onChainDisconnected });
  const onDisconnect = useCallback(async () => {
    disconnectChainLink();
  }, [disconnectChainLink]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={{ navigation }} title={t('chain link')} />}
    >
      {/* Chain data */}
      <View style={styles.chainDetails}>
        <FastImage style={styles.chainLinkIcon} source={chainIcon} />
        <Spacer paddingVertical={8} />
        <Typography.Title>{chainName}</Typography.Title>
      </View>

      <Spacer paddingVertical={8} />

      {/* Link data */}
      <View>
        <Typography.Body1 style={styles.linkDetailTitle}>{t('external address')}</Typography.Body1>
        <Typography.Body>{chainLink.externalAddress}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('plain text')}</Typography.Body1>
        <Typography.Body>{chainLink.proof.plainText}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('signature')}</Typography.Body1>
        <Typography.Body>{chainLink.proof.signature}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('connected on')}</Typography.Body1>
        <Typography.Body>{format(chainLink.creationTime, 'EEE MMM dd, yyyy')}</Typography.Body>
      </View>

      {/* Disconnect button */}
      {canEdit && (
        <Button style={styles.disconnectButton} mode="outlined" onPress={onDisconnect}>
          {t('disconnect')}
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

export default ChainLinkDetails;
