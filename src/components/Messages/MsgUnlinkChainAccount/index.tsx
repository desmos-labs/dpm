import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import Typography from 'components/Typography';
import SupportedChains from 'config/LinkableChains';
import BaseMessage from '../BaseMessage';
import useStyles from './useStyles';

export type DetailsProps = {
  message: MsgUnlinkChainAccountEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgUnlinkChainAccountEncodeObject['value'];
  date: Date;
};

namespace MsgUnlinkChainAccount {
  /**
   * Displays the short details of a MsgUnlinkChainAccount within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
      <BaseMessage.ListItem
        icon={require('assets/images/messages/general.png')}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>{t('tx type unlink chain account')}</Typography.Body1>
            <View style={styles.target}>
              <Typography.Caption>{message.target}</Typography.Caption>
            </View>
          </View>
        )}
      />
    );
  };

  /**
   * Displays the full details of a MsgUnlinkChainAccount
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({ message }) => {
    const styles = StyleSheet.create({
      chainLinkIcon: {
        height: 44,
        width: 44,
      },
      customIconView: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
      },
      disconnectIcon: {
        height: 24,
        marginHorizontal: 20,
        width: 24,
      },
    });

    const { t } = useTranslation();
    const getLinkableChainInfoByName = useCallback(
      (chainName: string) => SupportedChains.find((chain) => chainName === chain.chainConfig.name),
      [],
    );

    const { chainName } = message;
    const chainIcon = useMemo(() => {
      const chain = chainName !== undefined ? getLinkableChainInfoByName(chainName) : undefined;
      if (chain !== undefined) {
        return chain.icon;
      }
      return require('assets/images/chains/cosmos.png');
    }, [chainName, getLinkableChainInfoByName]);

    return (
      <BaseMessage.Details
        customIconView={
          <View style={styles.customIconView}>
            <Image
              style={styles.chainLinkIcon}
              source={require('assets/images/chains/desmos.png')}
            />
            <Image style={styles.disconnectIcon} source={require('assets/images/disconnect.png')} />
            <Image style={styles.chainLinkIcon} source={chainIcon} />
          </View>
        }
        fields={[
          {
            label: t('unlinked account'),
            value: message.target,
          },
        ]}
      />
    );
  };
}

export default MsgUnlinkChainAccount;
