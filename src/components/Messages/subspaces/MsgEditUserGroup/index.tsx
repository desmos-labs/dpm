import { MsgEditUserGroupEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgEditUserGroupListItem from './MsgEditUserGroupListItem';
import MsgEditUserGroupDetails from './MsgEditUserGroupDetails';

const MsgEditUserGroupComponents: MessageComponents<MsgEditUserGroupEncodeObject> = {
  listItem: MsgEditUserGroupListItem,
  details: MsgEditUserGroupDetails,
};

export default MsgEditUserGroupComponents;
