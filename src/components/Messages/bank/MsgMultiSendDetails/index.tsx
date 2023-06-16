import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import { MsgMultiSendEncodeObject } from '@desmoslabs/desmjs';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { View } from 'react-native';

/**
 * Displays the full details of a MsgMultiSend
 * @constructor
 */
const MsgMultiSendDetails: MessageDetailsComponent<MsgMultiSendEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.bank');

  const mergedInputOutput = React.useMemo(
    () =>
      message.value.outputs.map((output, index) => {
        const sourceAddress = message.value.inputs[index]?.address ?? t('common:you');
        const destAddress = output.address;
        const amount = formatCoins(output.coins);
        return (
          <View key={`send-entry-${index}`}>
            {index > 0 && <Spacer paddingVertical={4} />}
            <Typography.Regular14>
              <Trans
                ns={'messages.bank'}
                i18nKey={'send description'}
                components={[
                  <CopiableAddress address={sourceAddress} />,
                  <Typography.SemiBold14 />,
                  <CopiableAddress address={destAddress} />,
                ]}
                values={{ amount }}
              />
            </Typography.Regular14>
          </View>
        );
      }),
    [],
  );

  return <BaseMessageDetails message={message} children={mergedInputOutput} />;
};

export default MsgMultiSendDetails;
