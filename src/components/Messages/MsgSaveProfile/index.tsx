import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSaveProfileDetails from './MsgSaveProfileDetails';
import MsgSaveProfileListItem from './MsgSaveProfileListItem';

const MsgSaveProfileComponents: MessageComponents<MsgSaveProfileEncodeObject['value']> = {
  details: MsgSaveProfileDetails,
  listItem: MsgSaveProfileListItem,
};

export default MsgSaveProfileComponents;
