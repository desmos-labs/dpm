import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgRevokeEncodeObject } from '@desmoslabs/desmjs';
import MsgRevokeDetails from './MsgRevokeDetails';
import MsgRevokeListItem from './MsgRevokeListItem';

const MsgRevokeComponents: MessageComponents<MsgRevokeEncodeObject> = {
  listItem: MsgRevokeListItem,
  details: MsgRevokeDetails,
};

export default MsgRevokeComponents;
