import { MsgRemoveReactionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgRemoveReactionListItem from './MsgRemoveReactionListItem';
import MsgRemoveReactionDetails from './MsgRemoveReactionDetails';

const MsgRemoveReactionComponents: MessageComponents<MsgRemoveReactionEncodeObject> = {
  listItem: MsgRemoveReactionListItem,
  details: MsgRemoveReactionDetails,
};

export default MsgRemoveReactionComponents;
