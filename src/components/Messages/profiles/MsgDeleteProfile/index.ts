import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import MsgDeleteProfileDetails from './MsgDeleteProfileDetails';
import MsgDeleteProfileListItem from './MsgDeleteProfileListItem';

const MsgDeleteProfileComponents: MessageComponents<MsgDeleteProfileEncodeObject> = {
  details: MsgDeleteProfileDetails,
  listItem: MsgDeleteProfileListItem,
};

export default MsgDeleteProfileComponents;
