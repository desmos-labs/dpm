import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgWithdrawDelegatorRewardsListItem from './MsgWithdrawDelegatorRewardsListItem';
import MsgWithdrawDelegatorRewardsDetails from './MsgWithdrawDelegatorRewardsDetails';

const MsgWithdrawDelegatorRewardsComponents: MessageComponents<
  MsgWithdrawDelegatorRewardEncodeObject['value']
> = {
  listItem: MsgWithdrawDelegatorRewardsListItem,
  details: MsgWithdrawDelegatorRewardsDetails,
};

export default MsgWithdrawDelegatorRewardsComponents;
