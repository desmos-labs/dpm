import Typography from 'components/Typography';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface TransactionsListSectionHeaderProps {
  readonly date: string;
}

const TransactionsListSectionHeader = (props: TransactionsListSectionHeaderProps) => {
  const { t } = useTranslation();
  const { date } = props;
  const styles = useStyles();

  const sectionDate = new Date(date);
  const currentDate = new Date();
  const isToday =
    currentDate.getUTCDay() === sectionDate.getUTCDay() &&
    currentDate.getUTCMonth() === sectionDate.getUTCMonth() &&
    currentDate.getUTCFullYear() === sectionDate.getUTCFullYear();

  return (
    <Typography.Body style={styles.header}>
      {isToday ? t('today') : formatDistanceToNow(sectionDate, { addSuffix: true })}
    </Typography.Body>
  );
};

export default TransactionsListSectionHeader;
