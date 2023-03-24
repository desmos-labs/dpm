import { MsgAddReasonEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAddReasonListItem from './MsgAddReasonListItem';
import MsgAddReasonDetails from './MsgAddReasonDetails';

const MsgAddReasonComponents: MessageComponents<MsgAddReasonEncodeObject> = {
  listItem: MsgAddReasonListItem,
  details: MsgAddReasonDetails,
};

export default MsgAddReasonComponents;
