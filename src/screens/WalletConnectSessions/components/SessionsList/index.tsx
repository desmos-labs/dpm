import React from 'react';
import ListItemSeparator from 'components/ListItemSeparator';
import { FlatList } from 'react-native';
import { WalletConnectSession } from 'types/walletConnect';
import SessionListItem from '../SessionListItem';
import useStyles from './useStyles';

interface SessionsListProps {
  readonly sessions: WalletConnectSession[];
}

const SessionsList = (props: SessionsListProps) => {
  const { sessions } = props;
  const styles = useStyles();
  return (
    <FlatList
      style={styles.root}
      data={sessions}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => <SessionListItem session={item} />}
      keyExtractor={(item) => item.topic}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
};

export default SessionsList;
