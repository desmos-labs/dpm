import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgDeleteRelationshipEncodeObject } from '@desmoslabs/desmjs';
import MsgDeleteRelationshipDetails from './MsgDeleteRelationshipDetails';
import MsgDeleteRelationshipListItem from './MsgDeleteRelationshipListItem';

const MsgDeleteRelationshipComponents: MessageComponents<MsgDeleteRelationshipEncodeObject> = {
  listItem: MsgDeleteRelationshipListItem,
  details: MsgDeleteRelationshipDetails,
};

export default MsgDeleteRelationshipComponents;
