import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgGrantEncodeObject } from '@desmoslabs/desmjs';
import MsgGrantDetails from './MsgGrantDetails';
import MsgGrantListItem from './MsgGrantListItem';

const MsgGrantComponents: MessageComponents<MsgGrantEncodeObject> = {
  listItem: MsgGrantListItem,
  details: MsgGrantDetails,
};

export default MsgGrantComponents;
