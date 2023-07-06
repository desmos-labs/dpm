import React from 'react';
import { ProposalStatus } from 'types/proposals';
import Badge from 'components/Badge';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

export interface ProposalStatusBadgeProps {
  /**
   * The proposal status to display.
   */
  status: ProposalStatus;
}

const ProposalStatusBadge: React.FC<ProposalStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation('governance');
  const theme = useTheme();

  // -------- VARIABLES --------

  const [backgroundColor, textColor] = React.useMemo(() => {
    switch (status) {
      case ProposalStatus.DepositPeriod:
        return [theme.colors.secondary100, theme.colors.secondary500];

      case ProposalStatus.VotingPeriod:
        return [theme.colors.primary, theme.colors.primary100];

      case ProposalStatus.Passed:
        return [theme.colors.feedbackSuccessBg, theme.colors.feedbackSuccess];

      case ProposalStatus.Failed:
      case ProposalStatus.Rejected:
        return [theme.colors.feedbackErrorBg, theme.colors.feedbackError];

      default:
        return ['#FFFFFF', theme.colors.neutral700];
    }
  }, [theme, status]);

  const statusText = React.useMemo(() => {
    switch (status) {
      case ProposalStatus.Unspecified:
        return t('proposal status unspecified');
      case ProposalStatus.DepositPeriod:
        return t('proposal status deposit period');

      case ProposalStatus.VotingPeriod:
        return t('proposal status voting period');

      case ProposalStatus.Passed:
        return t('proposal status passed');

      case ProposalStatus.Rejected:
        return t('proposal status rejected');

      case ProposalStatus.Failed:
        return t('proposal status failed');

      default:
        return t('proposal status unknown');
    }
  }, [t, status]);

  return <Badge text={statusText} backgroundColor={backgroundColor} textColor={textColor} />;
};

export default ProposalStatusBadge;
