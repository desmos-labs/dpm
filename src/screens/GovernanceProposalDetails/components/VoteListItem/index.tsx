import React from 'react';
import { ProposalVote, ProposalVoteOption } from 'types/proposals';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import { useQuery } from '@apollo/client';
import GetValidatorInfo from 'services/graphql/queries/GetValidatorInfo';
import AvatarImage from 'components/AvatarImage';
import { desmosLogoRound } from 'assets/images';
import useProfileGivenAddress from 'hooks/profile/useProfileGivenAddress';
import useStyles from './useStyles';

interface VoteListItemProps {
  /**
   * The user's proposal vote.
   */
  readonly proposalVote: ProposalVote;
}

/**
 * Component that shows the information about a user's proposal vote.
 */
const VoteListItem: React.FC<VoteListItemProps> = ({ proposalVote }) => {
  const { t } = useTranslation('governance');
  const styles = useStyles();

  // -------- HOOKS --------

  const { profile, loading: profileLoading } = useProfileGivenAddress(proposalVote.voterAddress);
  const { loading: validatorInfoLoading, data } = useQuery(GetValidatorInfo, {
    variables: {
      selfDelegateAddress: proposalVote.voterAddress,
    },
  });

  // -------- VARIABLES --------

  const loading = React.useMemo(
    () => profileLoading || validatorInfoLoading,
    [profileLoading, validatorInfoLoading],
  );

  const voterName = React.useMemo(() => {
    if (loading) {
      return undefined;
    }

    if (profile?.nickname !== undefined && profile.nickname !== '') {
      return profile.nickname;
    }

    if (data?.validator !== undefined && data.validator.length > 0) {
      return data.validator[0].validator_descriptions[0].moniker;
    }

    return proposalVote.voterAddress;
  }, [data?.validator, loading, profile?.nickname, proposalVote.voterAddress]);

  const voterImage = React.useMemo(() => {
    const profilePicture = profile?.profilePicture;

    if (profilePicture !== undefined && profilePicture !== '') {
      return { uri: profilePicture };
    }

    if (
      data?.validator !== undefined &&
      data.validator.length > 0 &&
      data.validator[0].validator_descriptions[0].avatar_url &&
      data.validator[0].validator_descriptions[0].avatar_url !== ''
    ) {
      return { uri: data.validator[0].validator_descriptions[0].avatar_url };
    }

    return desmosLogoRound;
  }, [data?.validator, profile?.profilePicture]);

  const voteResult = React.useMemo(() => {
    switch (proposalVote.option) {
      case ProposalVoteOption.Yes:
        return t('messages.gov:yes');
      case ProposalVoteOption.Abstain:
        return t('messages.gov:abstain');
      case ProposalVoteOption.No:
        return t('messages.gov:no');
      case ProposalVoteOption.NoWithVeto:
        return t('messages.gov:no with veto');
      default:
        return t('common:unknown');
    }
  }, [t, proposalVote.option]);

  const voteColor = React.useMemo(() => {
    switch (proposalVote.option) {
      case ProposalVoteOption.Yes:
        return styles.colorPositive;
      case ProposalVoteOption.Abstain:
        return styles.colorNeutral;
      case ProposalVoteOption.No:
      case ProposalVoteOption.NoWithVeto:
        return styles.colorNegative;
      default:
        return undefined;
    }
  }, [styles, proposalVote.option]);

  return (
    <View style={styles.root}>
      <View style={styles.profileInfo}>
        <AvatarImage source={voterImage} size={36} loading={loading} />

        <Spacer paddingHorizontal={4} />

        {profileLoading ? (
          <TypographyContentLoaders.Regular16 width={200} />
        ) : (
          <Typography.Regular16
            style={styles.name}
            ellipsizeMode={'middle'}
            numberOfLines={voterName === proposalVote.voterAddress ? 1 : undefined}
          >
            {voterName}
          </Typography.Regular16>
        )}
      </View>

      <Typography.SemiBold16 style={voteColor}>{voteResult}</Typography.SemiBold16>
    </View>
  );
};

export default VoteListItem;
