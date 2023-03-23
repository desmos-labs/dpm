import { MsgCreateUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgCreateUserGroupListItem from './MsgCreateUserGroupListItem';
import MsgCreateUserGroupDetails from './MsgCreateUserGroupDetails';

const MsgCreateUserGroupComponents: MessageComponents<MsgCreateUserGroupEncodeObject> = {
  listItem: MsgCreateUserGroupListItem,
  details: MsgCreateUserGroupDetails,
};

export default MsgCreateUserGroupComponents;
