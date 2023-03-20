import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgBlockUserEncodeObject } from '@desmoslabs/desmjs';
import MsgBlockUserDetails from './MsgBlockUserDetails';
import MsgBlockUserListItem from './MsgBlockUserListItem';

const MsgBlockUserComponents: MessageComponents<MsgBlockUserEncodeObject> = {
  listItem: MsgBlockUserListItem,
  details: MsgBlockUserDetails,
};

export default MsgBlockUserComponents;
