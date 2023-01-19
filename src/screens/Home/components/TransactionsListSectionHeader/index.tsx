import Typography from 'components/Typography';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useStyles from './useStyles';

export interface TransactionsListSectionHeaderProps {
  readonly date: string;
}

const TransactionsListSectionHeader = (props: TransactionsListSectionHeaderProps) => {
  const { t } = useTranslation();
  const { date } = props;
  const styles = useStyles();
  const sectionDate = new Date(date);
  const isToday = differenceInDays(sectionDate, new Date()) === 0;

  return (
    <View style={styles.headerContainer}>
      <Typography.Body style={styles.header}>
        {isToday ? t('today') : formatDistanceToNow(sectionDate, { addSuffix: true })}
      </Typography.Body>
    </View>
  );
};

export default TransactionsListSectionHeader;
