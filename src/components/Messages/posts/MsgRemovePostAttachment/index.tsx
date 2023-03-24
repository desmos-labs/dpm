import { MsgRemovePostAttachmentEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgRemovePostAttachmentListItem from './MsgRemovePostAttachmentListItem';
import MsgRemovePostAttachmentDetails from './MsgRemovePostAttachmentDetails';

const MsgRemovePostAttachmentComponents: MessageComponents<MsgRemovePostAttachmentEncodeObject> = {
  listItem: MsgRemovePostAttachmentListItem,
  details: MsgRemovePostAttachmentDetails,
};

export default MsgRemovePostAttachmentComponents;
