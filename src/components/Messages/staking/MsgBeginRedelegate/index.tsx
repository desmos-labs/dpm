import { MsgBeginRedelegateEncodeObject } from '@cosmjs/stargate';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgBeginRedelegateListItem from './MsgBeginRedelegateListItem';
import MsgBeginRedelegateDetails from './MsgBeginRedelegateDetails';

const MsgBeginRedelegateComponents: MessageComponents<MsgBeginRedelegateEncodeObject> = {
  listItem: MsgBeginRedelegateListItem,
  details: MsgBeginRedelegateDetails,
};

export default MsgBeginRedelegateComponents;
