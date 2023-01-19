import { MessageComponents } from 'components/Messages/BaseMessage';
import { EncodeObject } from '@cosmjs/proto-signing';
import MsgUnknownDetails from './MsgUnknownDetails';
import MsgUnknownListItem from './MsgUnknownListItem';

const MsgUnknownComponents: MessageComponents<EncodeObject> = {
  details: MsgUnknownDetails,
  listItem: MsgUnknownListItem,
};

export default MsgUnknownComponents;
