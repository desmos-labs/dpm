import { MsgAddPostAttachmentEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAddPostAttachmentListItem from './MsgAddPostAttachmentListItem';
import MsgAddPostAttachmentDetails from './MsgAddPostAttachmentDetails';

const MsgAddPostAttachmentComponents: MessageComponents<MsgAddPostAttachmentEncodeObject> = {
  listItem: MsgAddPostAttachmentListItem,
  details: MsgAddPostAttachmentDetails,
};

export default MsgAddPostAttachmentComponents;
