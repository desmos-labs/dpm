import { MsgMoveSectionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgMoveSectionListItem from './MsgMoveSectionListItem';
import MsgMoveSectionDetails from './MsgMoveSectionDetails';

const MsgMoveSectionComponents: MessageComponents<MsgMoveSectionEncodeObject> = {
  listItem: MsgMoveSectionListItem,
  details: MsgMoveSectionDetails,
};

export default MsgMoveSectionComponents;
