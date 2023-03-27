import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgLinkApplicationEncodeObject } from '@desmoslabs/desmjs';
import MsgLinkApplicationDetails from './MsgLinkApplicationDetails';
import MsgLinkApplicationListItem from './MsgLinkApplicationListItem';

const MsgLinkApplicationComponents: MessageComponents<MsgLinkApplicationEncodeObject> = {
  listItem: MsgLinkApplicationListItem,
  details: MsgLinkApplicationDetails,
};

export default MsgLinkApplicationComponents;
