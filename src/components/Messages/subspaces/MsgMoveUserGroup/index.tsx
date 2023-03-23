import { MsgMoveUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgMoveUserGroupListItem from './MsgMoveUserGroupListItem';
import MsgMoveUserGroupDetails from './MsgMoveUserGroupDetails';

const MsgMoveUserGroupComponents: MessageComponents<MsgMoveUserGroupEncodeObject> = {
  listItem: MsgMoveUserGroupListItem,
  details: MsgMoveUserGroupDetails,
};

export default MsgMoveUserGroupComponents;
