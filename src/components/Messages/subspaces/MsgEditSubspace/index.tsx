import { MsgEditSubspaceEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgEditSubspaceListItem from './MsgEditSubspaceListItem';
import MsgEditSubspaceDetails from './MsgEditSubspaceDetails';

const MsgEditSubspaceComponents: MessageComponents<MsgEditSubspaceEncodeObject> = {
  listItem: MsgEditSubspaceListItem,
  details: MsgEditSubspaceDetails,
};

export default MsgEditSubspaceComponents;
