import { MsgDeleteSectionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDeleteSectionListItem from './MsgDeleteSectionListItem';
import MsgDeleteSectionDetails from './MsgDeleteSectionDetails';

const MsgDeleteSectionComponents: MessageComponents<MsgDeleteSectionEncodeObject> = {
  listItem: MsgDeleteSectionListItem,
  details: MsgDeleteSectionDetails,
};

export default MsgDeleteSectionComponents;
