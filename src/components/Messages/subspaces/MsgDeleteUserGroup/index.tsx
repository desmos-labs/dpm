import { MsgDeleteUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDeleteUserGroupListItem from './MsgDeleteUserGroupListItem';
import MsgDeleteUserGroupDetails from './MsgDeleteUserGroupDetails';

const MsgDeleteUserGroupComponents: MessageComponents<MsgDeleteUserGroupEncodeObject> = {
  listItem: MsgDeleteUserGroupListItem,
  details: MsgDeleteUserGroupDetails,
};

export default MsgDeleteUserGroupComponents;
