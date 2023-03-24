import { MsgAddReactionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAddReactionListItem from './MsgAddReactionListItem';
import MsgAddReactionDetails from './MsgAddReactionDetails';

const MsgAddReactionComponents: MessageComponents<MsgAddReactionEncodeObject> = {
  listItem: MsgAddReactionListItem,
  details: MsgAddReactionDetails,
};

export default MsgAddReactionComponents;
