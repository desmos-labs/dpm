import { MsgRemoveReasonEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgRemoveReasonListItem from './MsgRemoveReasonListItem';
import MsgRemoveReasonDetails from './MsgRemoveReasonDetails';

const MsgRemoveReasonComponents: MessageComponents<MsgRemoveReasonEncodeObject> = {
  listItem: MsgRemoveReasonListItem,
  details: MsgRemoveReasonDetails,
};

export default MsgRemoveReasonComponents;
