import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  MsgGrantAllowanceEncodeObject,
  PeriodicAllowanceTypeUrl,
  timestampToDate,
} from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { parseAllowance } from 'lib/FeegrantUtils/parse';
import { formatCoins } from 'lib/FormatUtils';
import * as datefns from 'date-fns';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { TFunction } from 'i18next';

/**
 * Function to generate the fields of an allowance.
 * @param allowance - The allowance of interest.
 * @param t - The i18n function.
 */
function allowanceToFields(
  allowance: Any | undefined,
  t: TFunction<'messages.feegrant', undefined, 'messages.feegrant'>,
): Array<{
  label: string;
  value: string;
}> {
  const parsedAllowanceResult = parseAllowance(allowance);

  // Parse failed return a field with the error message.
  if (parsedAllowanceResult.isErr()) {
    return [
      {
        label: t('allowance'),
        value: parsedAllowanceResult.error.message,
      },
    ];
  }

  const parsedAllowance = parsedAllowanceResult.value;

  const fields: Array<{ label: string; value: string }> = [];
  // No allowance, return the empty fields array.
  if (parsedAllowance === undefined) {
    return fields;
  }

  // Push a field with the allowance type.
  fields.push({
    label: t('allowance'),
    value: parsedAllowance.typeUrl,
  });

  switch (parsedAllowance.typeUrl) {
    case BasicAllowanceTypeUrl:
      fields.push(
        ...[
          {
            label: t('spend limit'),
            value: formatCoins(parsedAllowance.allowance.spendLimit),
          },
          {
            label: t('expiration'),
            value: parsedAllowance.allowance.expiration
              ? datefns.format(
                  timestampToDate(parsedAllowance.allowance.expiration),
                  'dd MMM yyyy, HH:mm:ss',
                )
              : '',
          },
        ],
      );
      break;
    case PeriodicAllowanceTypeUrl:
      fields.push(
        ...[
          {
            label: t('period'),
            value: `${parsedAllowance.allowance.period?.seconds?.toString() ?? '0'}s`,
          },
          {
            label: t('spend limit'),
            value: formatCoins(parsedAllowance.allowance.periodSpendLimit),
          },
          {
            label: t('can spend'),
            value: formatCoins(parsedAllowance.allowance.periodCanSpend),
          },
          {
            label: t('period reset'),
            value: parsedAllowance.allowance.periodReset
              ? datefns.format(
                  timestampToDate(parsedAllowance.allowance.periodReset),
                  'dd MMM yyyy, HH:mm:ss',
                )
              : '',
          },
        ],
      );
      if (parsedAllowance.allowance.basic !== undefined) {
        fields.push(
          ...[
            {
              label: t('basic spend limit'),
              value: formatCoins(parsedAllowance.allowance.basic.spendLimit),
            },
            {
              label: t('basic expiration'),
              value: parsedAllowance.allowance.basic.expiration
                ? datefns.format(
                    timestampToDate(parsedAllowance.allowance.basic.expiration),
                    'dd MMM yyyy, HH:mm:ss',
                  )
                : '',
            },
          ],
        );
      }
      break;

    case AllowedMsgAllowanceTypeUrl:
      fields.push(
        ...[
          {
            label: t('allowed messages'),
            value: parsedAllowance.allowance.allowedMessages.join('\n'),
          },
        ],
      );
      // Generate the fields related to allowance included in the AllowedMsgAllowance.
      fields.push(...allowanceToFields(parsedAllowance.allowance.allowance, t));
      break;

    default:
      break;
  }

  return fields;
}

type MsgGrantAllowanceDetailsPops = MessageDetailsComponentProps<MsgGrantAllowanceEncodeObject>;

const MsgGrantAllowanceDetails: React.FC<MsgGrantAllowanceDetailsPops> = ({ message }) => {
  const { t } = useTranslation('messages.feegrant');
  const { granter, grantee, allowance } = message.value;

  const allowanceFields = React.useMemo(() => {
    const fields: Array<{ label: string; value: string }> = [
      {
        label: t('granter'),
        value: granter,
      },
      {
        label: t('grantee'),
        value: grantee,
      },
    ];
    fields.push(...allowanceToFields(allowance, t));
    return fields;
  }, [t, granter, grantee, allowance]);

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('grant allowance')}
      fields={allowanceFields}
    />
  );
};

export default MsgGrantAllowanceDetails;
