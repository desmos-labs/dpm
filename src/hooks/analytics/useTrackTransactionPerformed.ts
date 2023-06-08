import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import {
  MsgLinkChainAccountEncodeObject,
  MsgUnlinkChainAccountEncodeObject,
} from '@desmoslabs/desmjs';

/**
 * Convert a msg to a PostHog event that can be sent to the server to
 * track a user action.
 * @param msg - The message to convert.
 */
const mapMessageToEvents = (msg: EncodeObject): [string, Record<string, any>] | undefined => {
  // Get the msg name so that we reduce the maintenance of this function
  // if the typeUrl changes due to a version bump.
  // For example from "/desmos.profiles.v3.MsgSaveProfile" we extract "MsgSaveProfile"
  const msgName = msg.typeUrl.split('.').pop();

  switch (msgName) {
    // Profile messages
    case 'MsgSaveProfile':
      return ['Save Profile', {}];
    case 'MsgLinkChainAccount':
      return [
        'Link Chain Account',
        {
          'Chain Name': (msg as MsgLinkChainAccountEncodeObject).value.chainConfig?.name,
        },
      ];
    case 'MsgUnlinkChainAccount':
      return [
        'Unlink Chain Account',
        {
          'Chain Name': (msg as MsgUnlinkChainAccountEncodeObject).value.chainName,
        },
      ];

    // Staking messages
    case 'MsgDelegate':
      return ['Delegate Tokens', {}];
    case 'MsgWithdrawDelegatorReward':
      return ['Withdraw Rewards', {}];
    case 'MsgBeginRedelegate':
      return ['Redelegate Tokens', {}];
    case 'MsgUndelegate':
      return ['Undelegate Tokens', {}];

    // Bank messages
    case 'MsgSend':
      return ['Send Tokens', {}];
    default:
      return undefined;
  }
};

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (msgs: EncodeObject[]) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      // Remove duplicated items, this can happen when the
      // user for example withdraw from multiple validators,
      // to avoid reporting multiple time the same action we filter out
      // the duplicated messages.
      const deduplicatedMessages = Object.values(
        msgs.reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue.typeUrl]: currentValue,
          }),
          {} as Record<string, EncodeObject>,
        ),
      );

      // Convert the messages into posthog events.
      const events = deduplicatedMessages
        .map(mapMessageToEvents)
        // Filter out the undefined since we may have some
        // messages that we don't want to track.
        .filter((e) => e !== undefined) as [[string, Record<string, any>]];

      events.forEach(([event, properties]) => {
        postHog.capture(event, properties);
      });
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackTransactionPerformed;
