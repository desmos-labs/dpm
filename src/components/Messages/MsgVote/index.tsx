import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgVoteListItem from './MsgVoteListItem';
import MsgVoteDetails from './MsgVoteDetails';

const MsgVoteComponents: MessageComponents<MsgVoteEncodeObject['value']> = {
  listItem: MsgVoteListItem,
  details: MsgVoteDetails,
};

export default MsgVoteComponents;
