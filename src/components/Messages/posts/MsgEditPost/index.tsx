import { MsgEditPostEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgEditPostListItem from './MsgEditPostListItem';
import MsgEditPostDetails from './MsgEditPostDetails';

const MsgEditPostComponents: MessageComponents<MsgEditPostEncodeObject> = {
  listItem: MsgEditPostListItem,
  details: MsgEditPostDetails,
};

export default MsgEditPostComponents;
