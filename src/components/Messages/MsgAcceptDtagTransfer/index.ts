import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgAcceptDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import MsgAcceptDtagTransferDetails from './MsgAcceptDtagTransferDetails';
import MsgAcceptDtagTransferListItem from './MsgAcceptDtagTransferListItem';

const MsgAcceptDtagTransferComponents: MessageComponents<MsgAcceptDTagTransferRequestEncodeObject> =
  {
    listItem: MsgAcceptDtagTransferListItem,
    details: MsgAcceptDtagTransferDetails,
  };

export default MsgAcceptDtagTransferComponents;
