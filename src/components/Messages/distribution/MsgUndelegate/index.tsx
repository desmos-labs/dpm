import { MsgUndelegateEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgUndelegateListItem from './MsgUndelegateListItem';
import MsgUndelegateDetails from './MsgUndelegateDetails';

const MsgUndelegateComponents: MessageComponents<MsgUndelegateEncodeObject> = {
  listItem: MsgUndelegateListItem,
  details: MsgUndelegateDetails,
};

export default MsgUndelegateComponents;
