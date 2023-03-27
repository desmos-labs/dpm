import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgLinkChainAccountListItem from './MsgLinkChainAccountListItem';
import MsgLinkChainAccountDetails from './MsgLinkChainAccountDetails';

const MsgLinkChainAccountComponents: MessageComponents<MsgLinkChainAccountEncodeObject> = {
  listItem: MsgLinkChainAccountListItem,
  details: MsgLinkChainAccountDetails,
};

export default MsgLinkChainAccountComponents;
