import { MsgDeleteSubspaceEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDeleteSubspaceListItem from './MsgDeleteSubspaceListItem';
import MsgDeleteSubspaceDetails from './MsgDeleteSubspaceDetails';

const MsgDeleteSubspaceComponents: MessageComponents<MsgDeleteSubspaceEncodeObject> = {
  listItem: MsgDeleteSubspaceListItem,
  details: MsgDeleteSubspaceDetails,
};

export default MsgDeleteSubspaceComponents;
