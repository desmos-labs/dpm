import { MsgRemoveRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgRemoveRegisteredReactionListItem from './MsgRemoveRegisteredReactionListItem';
import MsgRemoveRegisteredReactionDetails from './MsgRemoveRegisteredReactionDetails';

const MsgRemoveRegisteredReactionComponents: MessageComponents<MsgRemoveRegisteredReactionEncodeObject> =
  {
    listItem: MsgRemoveRegisteredReactionListItem,
    details: MsgRemoveRegisteredReactionDetails,
  };

export default MsgRemoveRegisteredReactionComponents;
