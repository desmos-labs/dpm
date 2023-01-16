import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgLinkChainAccountListItem from './MsgLinkChainAccountListItem';
import MsgLinkChainAccountDetails from './MsgLinkChainAccountDetails';

const MsgLinkChainAccountComponents: MessageComponents<MsgLinkChainAccountEncodeObject['value']> = {
  listItem: MsgLinkChainAccountListItem,
  details: MsgLinkChainAccountDetails,
};

export default MsgLinkChainAccountComponents;
