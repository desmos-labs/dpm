import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgUnlinkApplicationEncodeObject } from '@desmoslabs/desmjs';
import MsgUnlinkApplicationDetails from './MsgUnlinkApplicationDetails';
import MsgUnlinkApplicationListItem from './MsgUnlinkApplicationListItem';

const MsgUnlinkApplicationComponents: MessageComponents<MsgUnlinkApplicationEncodeObject> = {
  listItem: MsgUnlinkApplicationListItem,
  details: MsgUnlinkApplicationDetails,
};

export default MsgUnlinkApplicationComponents;
