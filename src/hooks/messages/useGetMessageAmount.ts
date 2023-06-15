import React from 'react';
import { Message } from 'types/transactions';
import { sumCoins } from 'lib/CoinsUtils';
import { getMessageAmount } from 'lib/MessageUtils';
import { formatCoins } from 'lib/FormatUtils';

/**
 * Hook that provides a function to extract the
 * amount of coins present inside a message.
 */
const useMessagesAmount = (messages: Message[]) =>
  React.useMemo(() => {
    const amount = messages
      .map(getMessageAmount)
      .reduce((previousValue, currentValue) => sumCoins(previousValue, currentValue), []);

    if (amount === undefined || amount.length === 0) {
      return '-';
    }
    return formatCoins(amount);
  }, [messages]);

export default useMessagesAmount;
