import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgUnknownDetails from './MsgUnknownDetails';
import MsgUnknownListItem from './MsgUnknownListItem';

const MsgUnknownComponents: MessageComponents<any> = {
  details: MsgUnknownDetails,
  listItem: MsgUnknownListItem,
};

export default MsgUnknownComponents;
