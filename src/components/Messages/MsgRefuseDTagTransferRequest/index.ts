import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgRefuseDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import MsgRefuseDtagTransferRequestDetails from './MsgRefuseDTagTransferRequestDetails';
import MsgRefuseDtagTransferRequestListItem from './MsgRefuseDTagTransferRequestListItem';

const MsgRefuseDtagTransferRequestComponents: MessageComponents<MsgRefuseDTagTransferRequestEncodeObject> =
  {
    listItem: MsgRefuseDtagTransferRequestListItem,
    details: MsgRefuseDtagTransferRequestDetails,
  };

export default MsgRefuseDtagTransferRequestComponents;
