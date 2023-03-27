import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgUnblockUserEncodeObject } from '@desmoslabs/desmjs';
import MsgUnblockUserDetails from './MsgUnblockUserDetails';
import MsgUnblockUserListItem from './MsgUnblockUserListItem';

const MsgUnblockUserComponents: MessageComponents<MsgUnblockUserEncodeObject> = {
  listItem: MsgUnblockUserListItem,
  details: MsgUnblockUserDetails,
};

export default MsgUnblockUserComponents;
