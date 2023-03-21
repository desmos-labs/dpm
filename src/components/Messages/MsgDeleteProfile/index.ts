import { MessageComponents } from 'components/Messages/BaseMessage';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import MsgDeleteProfileDetails from 'components/Messages/MsgDeleteProfile/MsgDeleteProfileDetails';
import MsgDeleteProfileListItem from 'components/Messages/MsgDeleteProfile/MsgDeleteProfileListItem';

const MsgDeleteProfileComponents: MessageComponents<MsgDeleteProfileEncodeObject> = {
  details: MsgDeleteProfileDetails,
  listItem: MsgDeleteProfileListItem,
};

export default MsgDeleteProfileComponents;
