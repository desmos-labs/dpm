import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgLinkChainAccountEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgLinkChainAccount within a list.
 * @constructor
 */
export const MessageLinkChainAccountListItem: React.FC<Props> = ({ message, date }) => {
  const { t } = useTranslation();

  const { chainAddress } = message;
  const chainAccount = useMemo(() => {
    if (chainAddress !== undefined) {
      const bech32Address = Bech32Address.decode(chainAddress.value);
      return bech32Address.value;
    }
    return 'unknown address';
  }, [chainAddress]);

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/general.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type link chain account')}</Typography.Body1>
          <View style={{ flexDirection: 'row', flexShrink: 1 }}>
            <Typography.Caption>
              {t('to')} {chainAccount}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};
