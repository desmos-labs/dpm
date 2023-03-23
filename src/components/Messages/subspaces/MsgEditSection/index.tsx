import { MsgEditSectionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgEditSectionListItem from './MsgEditSectionListItem';
import MsgEditSectionDetails from './MsgEditSectionDetails';

const MsgEditSectionComponents: MessageComponents<MsgEditSectionEncodeObject> = {
  listItem: MsgEditSectionListItem,
  details: MsgEditSectionDetails,
};

export default MsgEditSectionComponents;
