import { MsgCreateSubspaceEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgCreateSubspaceListItem from './MsgCreateSubspaceListItem';
import MsgCreateSubspaceDetails from './MsgCreateSubspaceDetails';

const MsgCreateSubspaceComponents: MessageComponents<MsgCreateSubspaceEncodeObject> = {
  listItem: MsgCreateSubspaceListItem,
  details: MsgCreateSubspaceDetails,
};

export default MsgCreateSubspaceComponents;
