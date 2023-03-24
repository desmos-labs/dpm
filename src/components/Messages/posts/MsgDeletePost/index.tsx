import { MsgDeletePostEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDeletePostListItem from './MsgDeletePostListItem';
import MsgDeletePostDetails from './MsgDeletePostDetails';

const MsgDeletePostComponents: MessageComponents<MsgDeletePostEncodeObject> = {
  listItem: MsgDeletePostListItem,
  details: MsgDeletePostDetails,
};

export default MsgDeletePostComponents;
