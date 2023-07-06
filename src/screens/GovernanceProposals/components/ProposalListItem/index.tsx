import { Proposal } from 'types/proposals';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import ProposalStatusBadge from 'components/ProposalStatusBadge';
import useStyles from './useStyles';

export interface ProposalListItemProps {
  /**
   * The proposal to display.
   */
  readonly proposal: Proposal;
  /**
   * Optional callback called when the user press on the item.
   */
  readonly onPress?: (proposal: Proposal) => any;
}

/**
 * Component that display the information of a proposal.
 * This component is intended to be used in a list of items.
 */
const ProposalListItem: React.FC<ProposalListItemProps> = ({ proposal, onPress }) => {
  const styles = useStyles();

  // -------- CALLBACKS --------

  const onProposalPress = React.useCallback(() => {
    if (onPress !== undefined) {
      onPress(proposal);
    }
  }, [onPress, proposal]);

  return (
    <TouchableOpacity disabled={onPress === undefined} onPress={onProposalPress}>
      <View style={styles.root}>
        {/* Proposal Header */}
        <View style={styles.proposalHeader}>
          <Typography.Regular14>#{proposal.id}</Typography.Regular14>
          <ProposalStatusBadge status={proposal.status} />
        </View>

        <Spacer paddingVertical={6} />

        {/* Proposal information */}
        <Typography.H7 style={styles.proposalTitle}>{proposal.title}</Typography.H7>
        <Typography.Regular14 numberOfLines={2}>
          {proposal.description.replace('\\n', '\n')}
        </Typography.Regular14>
      </View>
    </TouchableOpacity>
  );
};

export default ProposalListItem;
