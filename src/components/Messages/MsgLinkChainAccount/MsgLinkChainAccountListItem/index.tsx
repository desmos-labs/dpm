import React, { useMemo } from 'react';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import useStyles from './useStyles';

export type MsgLinkChainAccountListItemProps = {
  message: MsgLinkChainAccountEncodeObject;
  date: Date;
};

/**
 * Displays the short details of a MsgLinkChainAccount within a list.
 * @constructor
 */
const MsgLinkChainAccountListItem = (props: MsgLinkChainAccountListItemProps) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { message, date } = props;
  const { value } = message;
  const { chainAddress } = value;

  const chainAccount = useMemo(() => {
    if (chainAddress !== undefined) {
      const bech32Address = Bech32Address.decode(chainAddress.value);
      return bech32Address.value;
    }
    return 'MsgUnknown address';
  }, [chainAddress]);

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type link chain account')}</Typography.Body1>
          <View style={styles.chainAccount}>
            <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
              {t('to')} {chainAccount}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgLinkChainAccountListItem;
