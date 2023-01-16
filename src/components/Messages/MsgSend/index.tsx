import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSendDetails from './MsgDetailsListItem';
import MsgSendListItem from './MsgSendListItem';

export const MsgSendComponents: MessageComponents<MsgSendEncodeObject['value']> = {
  details: MsgSendDetails,
  listItem: MsgSendListItem,
};

export default MsgSendComponents;
