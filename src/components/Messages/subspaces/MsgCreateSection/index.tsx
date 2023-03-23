import { MsgCreateSectionEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgCreateSectionListItem from './MsgCreateSectionListItem';
import MsgCreateSectionDetails from './MsgCreateSectionDetails';

const MsgCreateSectionComponents: MessageComponents<MsgCreateSectionEncodeObject> = {
  listItem: MsgCreateSectionListItem,
  details: MsgCreateSectionDetails,
};

export default MsgCreateSectionComponents;
