import React from 'react';
import { ModalComponentProps } from 'modals/ModalScreen';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {
  slashBlack,
  slashWhite,
  thumpsDownBlack,
  thumpsDownWhite,
  thumpsUpBlack,
  thumpsUpWhite,
} from 'assets/images';
import useIsCurrentThemeDark from 'hooks/useIsCurrentThemeDark';
import { VoteOption } from '@desmoslabs/desmjs-types/cosmos/gov/v1/gov';
import { Proposal } from 'types/proposals';
import TxMemoInput from 'components/TxMemoInput';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

export type GovernanceVoteModalParams = {
  /**
   * The proposal to which the user voted.
   */
  readonly proposal: Proposal;
  /**
   * The {@link VoteOption} that has been selected from the user.
   */
  readonly voteOption: VoteOption;
  /**
   * Function called when the user clicks on the next button.
   */
  readonly onNextPressed: (proposal: Proposal, option: VoteOption, memo?: string) => void;
};

/**
 * Modal that shows what the user the selected vote option of a proposal and let him
 * write a memo that should be added in the vote transaction.
 */
const GovernanceVoteModal: React.FC<ModalComponentProps<GovernanceVoteModalParams>> = (props) => {
  const { closeModal } = props;
  const { proposal, voteOption, onNextPressed } = props.params;
  const isDarkTheme = useIsCurrentThemeDark();
  const styles = useStyles();
  const { t } = useTranslation('governance');

  // -------- STATES --------

  const [memo, setMemo] = React.useState<string>();

  const voteOptionIcon = React.useMemo(() => {
    switch (voteOption) {
      case VoteOption.VOTE_OPTION_YES:
        return isDarkTheme ? thumpsUpWhite : thumpsUpBlack;
      case VoteOption.VOTE_OPTION_NO:
        return isDarkTheme ? thumpsDownWhite : thumpsDownBlack;
      case VoteOption.VOTE_OPTION_NO_WITH_VETO:
        return isDarkTheme ? thumpsDownWhite : thumpsDownBlack;
      default:
        return isDarkTheme ? slashWhite : slashBlack;
    }
  }, [isDarkTheme, voteOption]);

  const voteOptionText = React.useMemo(() => {
    switch (voteOption) {
      case VoteOption.VOTE_OPTION_YES:
        return t('vote yes on proposal', { proposalId: proposal.id });
      case VoteOption.VOTE_OPTION_NO:
        return t('vote no on proposal', { proposalId: proposal.id });
      case VoteOption.VOTE_OPTION_NO_WITH_VETO:
        return t('vote no with veto on proposal', { proposalId: proposal.id });
      default:
        return t('vote abstain on proposal', { proposalId: proposal.id });
    }
  }, [proposal.id, t, voteOption]);

  const onButtonPressed = React.useCallback(() => {
    closeModal();
    onNextPressed(proposal, voteOption, memo);
  }, [closeModal, memo, onNextPressed, proposal, voteOption]);

  return (
    <View>
      <Typography.H6 style={styles.title} capitalize>
        {t('common:transaction')}
      </Typography.H6>
      <Spacer paddingVertical={12} />

      <View style={styles.voteOption}>
        <Image source={voteOptionIcon} style={styles.voteOptionIcon} />
        <Typography.Regular16>{voteOptionText}</Typography.Regular16>
      </View>
      <Spacer paddingVertical={12} />

      <Typography.Body1>{t('transaction:memo')}</Typography.Body1>
      <Spacer paddingVertical={4} />
      <TxMemoInput onChange={setMemo} value={memo} />
      <Spacer paddingVertical={20} />

      <Button onPress={onButtonPressed} mode="contained">
        {t('common:next')}
      </Button>
    </View>
  );
};

export default GovernanceVoteModal;
