import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDelegateListItem from './MsgDelegateListItem';
import MsgDelegateDetails from './MsgDelegateDetails';

const MsgDelegateComponents: MessageComponents<MsgDelegateEncodeObject> = {
  details: MsgDelegateDetails,
  listItem: MsgDelegateListItem,
};

export default MsgDelegateComponents;
