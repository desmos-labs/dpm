import {
  authorizationTypeToJSON,
  StakeAuthorization,
} from 'cosmjs-types/cosmos/staking/v1beta1/authz';
import { MessageDetailsField } from 'components/Messages/BaseMessage/BaseMessageDetails';
import { formatCoin, formatCoins } from 'lib/FormatUtils';
import { SendAuthorization } from 'cosmjs-types/cosmos/bank/v1beta1/authz';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { GenericSubspaceAuthorization } from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import { StakeAuthorizationTypeUrl } from 'types/cosmos';
import { Authz, Bank, Subspaces, timestampToDate } from '@desmoslabs/desmjs';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React from 'react';

const useGetStakeAuthorizationFields = () => {
  const { t } = useTranslation('messages.authz');

  return React.useCallback(
    (auth: StakeAuthorization) => {
      const fields: MessageDetailsField[] = [];
      fields.push({
        label: t('stake authorization type'),
        value: authorizationTypeToJSON(auth.authorizationType),
      });
      if (auth.allowList !== undefined) {
        fields.push({
          label: t('allow list'),
          value: auth.allowList.address.join('\n'),
        });
      }
      if (auth.denyList !== undefined) {
        fields.push({
          label: t('deny list'),
          value: auth.denyList.address.join('\n'),
        });
      }
      if (auth.maxTokens !== undefined) {
        fields.push({
          label: t('max tokens'),
          value: formatCoin(auth.maxTokens),
        });
      }

      return fields;
    },
    [t],
  );
};

function useGetSendAuthorizationFields() {
  const { t } = useTranslation('messages.authz');

  return React.useCallback(
    (auth: SendAuthorization) => [
      {
        label: t('spend limit'),
        value: formatCoins(auth.spendLimit),
      },
    ],
    [t],
  );
}

function useGetGenericAuthorizationFields() {
  const { t } = useTranslation('messages.authz');

  return React.useCallback(
    (auth: GenericAuthorization) => [
      {
        label: t('message'),
        value: auth.msg,
      },
    ],
    [t],
  );
}

function useGetGenericSubspaceAuthorizationFields() {
  const { t } = useTranslation('messages.authz');

  return React.useCallback(
    (auth: GenericSubspaceAuthorization) => [
      {
        label: t('message'),
        value: auth.msg,
      },
      {
        label: t('subspaces'),
        value: auth.subspacesIds.map((s) => s.toString()).join('\n'),
      },
    ],
    [t],
  );
}

export function useGrantFields(grant: Grant | undefined) {
  const { t } = useTranslation('messages.authz');
  const stakeAuthorizationFields = useGetStakeAuthorizationFields();
  const sendAuthorizationFields = useGetSendAuthorizationFields();
  const genericAuthorizationFields = useGetGenericAuthorizationFields();
  const genericSubspaceAuthorizationFields = useGetGenericSubspaceAuthorizationFields();

  return React.useMemo(() => {
    if (grant === undefined) {
      return [];
    }
    const fields: Array<MessageDetailsField> = [];

    fields.push({
      label: t('authorization'),
      value: grant.authorization?.typeUrl,
    });

    if (grant.authorization?.typeUrl !== undefined && grant.authorization?.value !== undefined) {
      switch (grant.authorization?.typeUrl) {
        case StakeAuthorizationTypeUrl:
          fields.push(
            ...stakeAuthorizationFields(StakeAuthorization.decode(grant.authorization.value)),
          );
          break;

        case Bank.v1beta1.SendAuthorizationTypeUrl:
          fields.push(
            ...sendAuthorizationFields(SendAuthorization.decode(grant.authorization.value)),
          );
          break;

        case Authz.v1beta1.GenericAuthorizationTypeUrl:
          fields.push(
            ...genericAuthorizationFields(GenericAuthorization.decode(grant.authorization.value)),
          );
          break;

        case Subspaces.v3.GenericSubspaceAuthorizationTypeUrl:
          fields.push(
            ...genericSubspaceAuthorizationFields(
              GenericSubspaceAuthorization.decode(grant.authorization.value),
            ),
          );
          break;

        default:
          // Keep this to have a warning in development.
          // eslint-disable-next-line no-console
          console.warn("can't generate fields for grant", grant.authorization.typeUrl);
          break;
      }
    }

    if (grant.expiration !== undefined) {
      fields.push({
        label: t('expiration'),
        value: format(timestampToDate(grant.expiration), 'dd MMM yyyy, HH:mm:ss'),
      });
    }

    return fields;
  }, [
    grant,
    genericAuthorizationFields,
    genericSubspaceAuthorizationFields,
    sendAuthorizationFields,
    stakeAuthorizationFields,
    t,
  ]);
}
