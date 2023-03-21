import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgRequestDTagTransferEncodeObject } from '@desmoslabs/desmjs';
import MsgRequestDtagTransferDetails from './MsgRequestDtagTransferDetails';
import MsgRequestDtagTransferListItem from './MsgRequestDtagTransferListItem';

const MsgRequestDtagTransferComponents: MessageComponents<MsgRequestDTagTransferEncodeObject> = {
  listItem: MsgRequestDtagTransferListItem,
  details: MsgRequestDtagTransferDetails,
};

export default MsgRequestDtagTransferComponents;
