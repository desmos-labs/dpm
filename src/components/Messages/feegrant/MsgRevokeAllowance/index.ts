import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgRevokeAllowanceEncodeObject } from '@desmoslabs/desmjs';
import MsgRevokeAllowanceDetails from './MsgRevokeAllowanceDetails';
import MsgRevokeAllowanceListItem from './MsgRevokeAllowanceListItem';

const MsgRevokeAllowanceComponents: MessageComponents<MsgRevokeAllowanceEncodeObject> = {
  listItem: MsgRevokeAllowanceListItem,
  details: MsgRevokeAllowanceDetails,
};

export default MsgRevokeAllowanceComponents;
