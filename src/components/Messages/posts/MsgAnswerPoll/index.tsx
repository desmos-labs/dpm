import { MsgAnswerPollEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgAnswerPollListItem from './MsgAnswerPollListItem';
import MsgAnswerPollDetails from './MsgAnswerPollDetails';

const MsgAnswerPollComponents: MessageComponents<MsgAnswerPollEncodeObject> = {
  listItem: MsgAnswerPollListItem,
  details: MsgAnswerPollDetails,
};

export default MsgAnswerPollComponents;
