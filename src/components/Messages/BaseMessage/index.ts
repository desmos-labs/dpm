import React from 'react';

/**
 * Props for a component that allows displaying a generic message inside a list.
 */
export type MessageListItemComponentProps<T> = {
  readonly message: T;
  readonly date: Date;
};

/**
 * Definition of a generic component that allows displaying a generic message inside a list.
 */
export type MessageListItemComponent<T> = React.FC<MessageListItemComponentProps<T>>;

/**
 * Props for a component that allows displaying a generic message's details.
 */
export type MessageDetailsComponentProps<T> = {
  readonly message: T;
};

/**
 * Definition of a generic component that allows displaying a generic message details.
 */
export type MessageDetailsComponent<T> = React.FC<MessageDetailsComponentProps<T>>;

/**
 * Components that allow displaying a message either inside a list or details view.
 */
export interface MessageComponents<T> {
  readonly listItem: MessageListItemComponent<T>;
  readonly details: MessageDetailsComponent<T>;
}
