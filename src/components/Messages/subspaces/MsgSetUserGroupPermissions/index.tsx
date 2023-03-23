import { MsgSetUserGroupPermissionsEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSetUserGroupPermissionsListItem from './MsgSetUserGroupPermissionsListItem';
import MsgSetUserGroupPermissionsDetails from './MsgSetUserGroupPermissionsDetails';

const MsgSetUserGroupPermissionsComponents: MessageComponents<MsgSetUserGroupPermissionsEncodeObject> =
  {
    listItem: MsgSetUserGroupPermissionsListItem,
    details: MsgSetUserGroupPermissionsDetails,
  };

export default MsgSetUserGroupPermissionsComponents;
