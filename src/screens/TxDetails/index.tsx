import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import TransactionDetails from 'components/TransactionDetails';
import { AccountScreensStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { useCurrentChainInfo } from '@recoil/settings';

export type Props = StackScreenProps<AccountScreensStackParams, 'TxDetails'>;

const TxDetails: React.FC<Props> = (props) => {
  const {
    route: {
      params: { fee, memo, success, dateTime, messages, hash },
    },
  } = props;
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const openExplorer = useCallback(() => {
    let txUrl: string;
    if (chainInfo.stakeCurrency.coinDenom === DesmosMainnet.stakeCurrency.coinDenom) {
      txUrl = `https://explorer.desmos.network/transactions/${hash}`;
    } else {
      txUrl = `https://morpheus.desmos.network/transactions/${hash}`;
    }
    Linking.openURL(txUrl).then(() => {});
  }, [hash, chainInfo]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TransactionDetails
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

export default TxDetails;
