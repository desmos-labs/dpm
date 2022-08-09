import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import { TransactionDetails as TxDetailsComponent } from '../components/Transaction/TransactionDetails';
import useCurrentChainInfo from '../hooks/desmosclient/useCurrentChainInfo';
import { AccountScreensStackParams } from '../types/navigation';

export type Props = StackScreenProps<AccountScreensStackParams, 'TxDetails'>;

export const TxDetails: React.FC<Props> = (props) => {
  const {
    route: {
      params: { fee, memo, success, dateTime, messages, hash },
    },
  } = props;
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const openExplorer = useCallback(() => {
    let txUrl: string;
    if (chainInfo.stakingDenom === 'udsm') {
      txUrl = `https://explorer.desmos.network/transactions/${hash}`;
    } else {
      txUrl = `https://morpheus.desmos.network/transactions/${hash}`;
    }
    Linking.openURL(txUrl).then(() => {});
  }, [hash, chainInfo]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TxDetailsComponent
        messages={messages}
        memo={memo}
        fee={fee}
        dateTime={dateTime}
        success={success}
      />
      <Button mode="text" onPress={openExplorer}>
        {t('view on explorer')}
      </Button>
    </StyledSafeAreaView>
  );
};
