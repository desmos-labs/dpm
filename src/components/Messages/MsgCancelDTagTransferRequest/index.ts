import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgCancelDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import MsgCancelDtagTransferRequestDetails from './MsgCancelDTagTransferRequestDetails';
import MsgCancelDtagTransferRequestListItem from './MsgCancelDTagTransferRequestListItem';

const MsgCancelDtagTransferRequestComponents: MessageComponents<MsgCancelDTagTransferRequestEncodeObject> =
  {
    listItem: MsgCancelDtagTransferRequestListItem,
    details: MsgCancelDtagTransferRequestDetails,
  };

export default MsgCancelDtagTransferRequestComponents;
