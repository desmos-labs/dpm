import { MsgAddRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAddRegisteredReactionListItem from './MsgAddRegisteredReactionListItem';
import MsgAddRegisteredReactionDetails from './MsgAddRegisteredReactionDetails';

const MsgAddRegisteredReactionComponents: MessageComponents<MsgAddRegisteredReactionEncodeObject> =
  {
    listItem: MsgAddRegisteredReactionListItem,
    details: MsgAddRegisteredReactionDetails,
  };

export default MsgAddRegisteredReactionComponents;
