import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgMultiSendDetails from 'components/Messages/MsgMultiSend/MsgMultiSendDetails';
import MsgMultiSendListItem from 'components/Messages/MsgMultiSend/MsgMultiSendListItem';

const MsgMultiSendComponents: MessageComponents<MsgMultiSendEncodeObject['value']> = {
  details: MsgMultiSendDetails,
  listItem: MsgMultiSendListItem,
};

export default MsgMultiSendComponents;
