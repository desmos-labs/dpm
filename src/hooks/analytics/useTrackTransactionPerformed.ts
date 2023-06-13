import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';
import { Profiles } from '@desmoslabs/desmjs';
import {
  EVENT_DELEGATE_TOKENS,
  EVENT_LINK_CHAIN,
  EVENT_REDELEGATE_TOKENS,
  EVENT_SAVE_PROFILE,
  EVENT_SEND_TOKENS,
  EVENT_UNDELEGATE_TOKENS,
  EVENT_UNLINK_CHAIN,
  EVENT_WITHDRAW_REWARDS,
} from 'types/analytics';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

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
      return [Events.SaveProfile, {}];
    case 'MsgLinkChainAccount':
      return [
        Events.LinkChain,
        {
          'Chain Name': (msg as Profiles.v3.MsgLinkChainAccountEncodeObject).value.chainConfig
            ?.name,
        },
      ];
    case 'MsgUnlinkChainAccount':
      return [
        Events.UnlinkChain,
        {
          'Chain Name': (msg as Profiles.v3.MsgUnlinkChainAccountEncodeObject).value.chainName,
        },
      ];

    // Staking messages
    case 'MsgDelegate':
      return [Events.DelegateTokens, {}];
    case 'MsgBeginRedelegate':
      return [Events.RedelegateTokens, {}];
    case 'MsgUndelegate':
      return [Events.UndelegateTokens, {}];

    // Distribution messages
    case 'MsgWithdrawDelegatorReward':
      return [Events.WithdrawRewards, {}];

    // Bank messages
    case 'MsgSend':
      return [Events.EventSendTokens, {}];
    default:
      return undefined;
  }
};

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const trackEvent = useTrackEvent();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    (msgs: EncodeObject[]) => {
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
        // Add the chain to the properties
        const completeProperties = { ...properties };
        completeProperties.Chain = isTestnetEvent ? 'Testnet' : 'Mainnet';

        trackEvent(event, completeProperties);
      });
    },
    [isTestnetEvent, trackEvent],
  );
};

export default useTrackTransactionPerformed;
