import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../../../utilils/find';
import {BaseMessage} from '../base/BaseMessage';
import {Typography} from "../../../typography";

export type DetailsProps = {
  message: MsgUnlinkChainAccountEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgUnlinkChainAccountEncodeObject["value"];
  date: Date;
};

export namespace MessageUnlinkChainAccount {
  /**
   * Displays the short details of a MsgUnlinkChainAccount within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
    const { t } = useTranslation();

    return (
      <BaseMessage.ListItem
        icon={require('../../../../assets/tx-icons/general.png')}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>{t('tx type unlink chain account')}</Typography.Body1>
            <View style={{ flexDirection: 'row', flexShrink: 1 }}>
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
  export const Details: React.FC<DetailsProps> = ({message}) => {
    const styles = StyleSheet.create({
      customIconView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      chainIcon: {
        width: 44,
        height: 44,
      },
      disconnectIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 20,
      },
    });

    const { t } = useTranslation();

    const { chainName}  = message;
    const chainIcon = useMemo(() => {
      const chain = chainName !== undefined ? findLinkableChainInfoByName(chainName) : undefined;
      if (chain !== undefined) {
        return chain.icon;
      }
      return require('../../../../assets/chains/cosmos.png');
    }, [chainName]);

    return (
      <BaseMessage.Details
        customIconView={
          <View style={styles.customIconView}>
            <Image style={styles.chainIcon} source={require('../../../../assets/chains/desmos.png')} />
            <Image style={styles.disconnectIcon} source={require('../../../../assets/disconnect.png')} />
            <Image style={styles.chainIcon} source={chainIcon} />
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


