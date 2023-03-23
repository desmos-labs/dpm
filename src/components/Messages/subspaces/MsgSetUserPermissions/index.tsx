import { MsgSetUserPermissionsEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSetUserPermissionsListItem from './MsgSetUserPermissionsListItem';
import MsgSetUserPermissionsDetails from './MsgSetUserPermissionsDetails';

const MsgSetUserPermissionsComponents: MessageComponents<MsgSetUserPermissionsEncodeObject> = {
  listItem: MsgSetUserPermissionsListItem,
  details: MsgSetUserPermissionsDetails,
};

export default MsgSetUserPermissionsComponents;
