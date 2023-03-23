import { MsgAddUserToUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAddUserToUserGroupListItem from './MsgAddUserToUserGroupListItem';
import MsgAddUserToUserGroupDetails from './MsgAddUserToUserGroupDetails';

const MsgAddUserToUserGroupComponents: MessageComponents<MsgAddUserToUserGroupEncodeObject> = {
  listItem: MsgAddUserToUserGroupListItem,
  details: MsgAddUserToUserGroupDetails,
};

export default MsgAddUserToUserGroupComponents;
