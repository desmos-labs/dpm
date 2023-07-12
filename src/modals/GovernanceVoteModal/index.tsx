import React from 'react';
import { ModalComponentProps } from 'modals/ModalScreen';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
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
import Spacer from 'components/Spacer';
import useIsCurrentThemeDark from 'hooks/useIsCurrentThemeDark';
import { VoteOption } from '@desmoslabs/desmjs-types/cosmos/gov/v1/gov';
import useStyles from './useStyles';

export type GovernanceVoteModalParams = {
  /**
   * Function called when the user clicks on the next button.
   */
  onSelect?: (option: VoteOption) => void;
};

/**
 * Modal that let the user select what to vote
 * in a governance proposal.
 */
const GovernanceVoteModal: React.FC<ModalComponentProps<GovernanceVoteModalParams>> = (props) => {
  const { closeModal } = props;
  const { onSelect } = props.params;
  const isDarkTheme = useIsCurrentThemeDark();
  const styles = useStyles();
  const { t } = useTranslation('governance');

  const [selectedOption, setSelectedOption] = React.useState<VoteOption>();
  const voteOptions = React.useMemo(
    () => [
      {
        i18nLabel: 'common:yes',
        icon: isDarkTheme ? thumpsUpWhite : thumpsUpBlack,
        selectedIcon: thumpsUpWhite,
        option: VoteOption.VOTE_OPTION_YES,
      },
      {
        i18nLabel: 'common:no',
        icon: isDarkTheme ? thumpsDownWhite : thumpsDownBlack,
        selectedIcon: thumpsDownWhite,
        option: VoteOption.VOTE_OPTION_NO,
      },
      {
        i18nLabel: 'governance:veto',
        icon: isDarkTheme ? thumpsDownWhite : thumpsDownBlack,
        selectedIcon: thumpsDownWhite,
        option: VoteOption.VOTE_OPTION_NO_WITH_VETO,
      },
      {
        i18nLabel: 'governance:abstain',
        icon: isDarkTheme ? slashWhite : slashBlack,
        selectedIcon: slashWhite,
        option: VoteOption.VOTE_OPTION_ABSTAIN,
      },
    ],
    [isDarkTheme],
  );

  const options = React.useMemo(
    () =>
      voteOptions.map((o, index, array) => {
        const isSelected = o.option === selectedOption;

        let selectedOptionStyle;
        if (o.option === VoteOption.VOTE_OPTION_YES) {
          selectedOptionStyle = styles.positiveSelected;
        } else if (
          o.option === VoteOption.VOTE_OPTION_NO ||
          o.option === VoteOption.VOTE_OPTION_NO_WITH_VETO
        ) {
          selectedOptionStyle = styles.negativeSelected;
        } else {
          selectedOptionStyle = styles.neutralSelected;
        }

        return (
          <View key={`vote-option-${o.option}`}>
            <TouchableOpacity onPress={() => setSelectedOption(o.option)}>
              <View style={[styles.voteOption, isSelected ? selectedOptionStyle : undefined]}>
                <Image
                  style={styles.voteOptionIcon}
                  source={isSelected ? o.selectedIcon : o.icon}
                />
                <Typography.Regular16 style={isSelected ? styles.selectedOptionText : undefined}>
                  {t(o.i18nLabel)}
                </Typography.Regular16>
              </View>
            </TouchableOpacity>
            {index + 1 !== array.length && <Spacer paddingVertical={8} />}
          </View>
        );
      }),
    [
      voteOptions,
      selectedOption,
      styles.negativeSelected,
      styles.neutralSelected,
      styles.positiveSelected,
      styles.selectedOptionText,
      styles.voteOption,
      styles.voteOptionIcon,
      t,
    ],
  );

  const onNextPressed = React.useCallback(() => {
    closeModal();
    if (onSelect) {
      onSelect(selectedOption!);
    }
  }, [closeModal, onSelect, selectedOption]);

  return (
    <View>
      <Typography.H6 style={styles.title} capitalize>
        {t('cast your vote')}
      </Typography.H6>
      <View style={styles.voteOptionsContainer}>{options}</View>
      <Button onPress={onNextPressed} disabled={selectedOption === undefined} mode="contained">
        {t('common:next')}
      </Button>
    </View>
  );
};

export default GovernanceVoteModal;
