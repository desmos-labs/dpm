import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgGrantAllowanceEncodeObject } from '@desmoslabs/desmjs';
import MsgGrantAllowanceDetails from './MsgGrantAllowanceDetails';
import MsgGrantAllowanceListItem from './MsgGrantAllowanceListItem';

const MsgGrantAllowanceComponents: MessageComponents<MsgGrantAllowanceEncodeObject> = {
  listItem: MsgGrantAllowanceListItem,
  details: MsgGrantAllowanceDetails,
};

export default MsgGrantAllowanceComponents;
