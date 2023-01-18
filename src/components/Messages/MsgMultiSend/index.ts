import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgMultiSendEncodeObject } from '@desmoslabs/desmjs';
import MsgMultiSendDetails from './MsgMultiSendDetails';
import MsgMultiSendListItem from './MsgMultiSendListItem';

const MsgMultiSendComponents: MessageComponents<MsgMultiSendEncodeObject> = {
  details: MsgMultiSendDetails,
  listItem: MsgMultiSendListItem,
};

export default MsgMultiSendComponents;
