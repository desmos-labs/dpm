import { MsgCreatePostEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgCreatePostListItem from './MsgCreatePostListItem';
import MsgCreatePostDetails from './MsgCreatePostDetails';

const MsgCreatePostComponents: MessageComponents<MsgCreatePostEncodeObject> = {
  listItem: MsgCreatePostListItem,
  details: MsgCreatePostDetails,
};

export default MsgCreatePostComponents;
