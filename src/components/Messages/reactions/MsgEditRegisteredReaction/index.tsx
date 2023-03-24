import { MsgEditRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgEditRegisteredReactionListItem from './MsgEditRegisteredReactionListItem';
import MsgEditRegisteredReactionDetails from './MsgEditRegisteredReactionDetails';

const MsgEditRegisteredReactionComponents: MessageComponents<MsgEditRegisteredReactionEncodeObject> =
  {
    listItem: MsgEditRegisteredReactionListItem,
    details: MsgEditRegisteredReactionDetails,
  };

export default MsgEditRegisteredReactionComponents;
