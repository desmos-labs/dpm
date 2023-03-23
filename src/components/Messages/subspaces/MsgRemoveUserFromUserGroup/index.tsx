import { MsgRemoveUserFromUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgRemoveUserFromUserGroupListItem from './MsgRemoveUserFromUserGroupListItem';
import MsgRemoveUserFromUserGroupDetails from './MsgRemoveUserFromUserGroupDetails';

const MsgRemoveUserFromUserGroupComponents: MessageComponents<MsgRemoveUserFromUserGroupEncodeObject> =
  {
    listItem: MsgRemoveUserFromUserGroupListItem,
    details: MsgRemoveUserFromUserGroupDetails,
  };

export default MsgRemoveUserFromUserGroupComponents;
