import { MsgSetReactionsParamsEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgSetReactionsParamsListItem from './MsgSetReactionsParamsListItem';
import MsgSetReactionsParamsDetails from './MsgSetReactionsParamsDetails';

const MsgSetReactionsParamsComponents: MessageComponents<MsgSetReactionsParamsEncodeObject> = {
  listItem: MsgSetReactionsParamsListItem,
  details: MsgSetReactionsParamsDetails,
};

export default MsgSetReactionsParamsComponents;
