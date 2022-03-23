import React, { useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { TxDetails as TxDetailsComponent } from '../components/tx/TxDetails';
import { AccountScreensStackParams } from '../types/navigation';
import { StyledSafeAreaView, TopBar, Button } from '../components';

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
    if (chainInfo.coinDenom === 'udsm') {
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
