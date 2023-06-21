import React from 'react';

/**
 * Props for a component that allows displaying a generic message's details.
 */
export type MessageDetailsComponentProps<T> = {
  readonly message: T;
  readonly toBroadcastMessage: boolean;
};

/**
 * Definition of a generic component that allows displaying a generic message details.
 */
export type MessageDetailsComponent<T> = React.FC<MessageDetailsComponentProps<T>>;
