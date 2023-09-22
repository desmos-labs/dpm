import { Coin } from '@desmoslabs/desmjs';
import { useCurrentChainInfo } from '@recoil/settings';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Typography from 'components/Typography';
import useAutoCancelQuery from 'hooks/apollo/useAutoCancelQuery';
import { formatCoin } from 'lib/FormatUtils';
import React from 'react';
import { View } from 'react-native';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface AccountListItemBalanceProps {
  readonly address: string;
}

/**
 * Component that displays the balance of an account.
 */
const AccountListItemBalance: React.FC<AccountListItemBalanceProps> = ({ address }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const chainConfig = useCurrentChainInfo();
  const { loading, data, error } = useAutoCancelQuery(GetAccountBalance, {
    fetchPolicy: 'cache-and-network',
    variables: {
      address,
    },
  });

  const balance = React.useMemo<string | undefined>(() => {
    const coinDenom = chainConfig!.stakeCurrency.coinMinimalDenom;
    let coin: Coin;
    if (data) {
      const coins: Coin[] = data.accountBalance.coins ?? [];
      coin = coins.find((c) => c.denom === coinDenom) ?? {
        denom: coinDenom,
        amount: '0',
      };
    } else {
      coin = {
        denom: coinDenom,
        amount: '0',
      };
    }
    return formatCoin(coin);
  }, [chainConfig, data]);

  if (error) {
    return (
      <View style={styles.root}>
        <Typography.Regular12 style={styles.errorText}>{error.message}</Typography.Regular12>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Typography.Regular12>{t('balance')} </Typography.Regular12>
      {loading ? (
        <TypographyContentLoaders.Regular12 width={100} />
      ) : (
        <Typography.Regular12 numberOfLines={1} ellipsizeMode="middle">
          {balance}
        </Typography.Regular12>
      )}
    </View>
  );
};

export default AccountListItemBalance;
