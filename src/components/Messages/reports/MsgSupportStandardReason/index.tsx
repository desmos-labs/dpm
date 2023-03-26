import { MsgSupportStandardReasonEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSupportStandardReasonListItem from './MsgSupportStandardReasonListItem';
import MsgSupportStandardReasonDetails from './MsgSupportStandardReasonDetails';

const MsgSupportStandardReasonComponents: MessageComponents<MsgSupportStandardReasonEncodeObject> =
  {
    listItem: MsgSupportStandardReasonListItem,
    details: MsgSupportStandardReasonDetails,
  };

export default MsgSupportStandardReasonComponents;
