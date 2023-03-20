import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs';
import MsgCreateRelationshipDetails from './MsgCreateRelationshipDetails';
import MsgCreateRelationshipListItem from './MsgCreateRelationshipListItem';

const MsgCreateRelationshipComponents: MessageComponents<MsgCreateRelationshipEncodeObject> = {
  listItem: MsgCreateRelationshipListItem,
  details: MsgCreateRelationshipDetails,
};

export default MsgCreateRelationshipComponents;
