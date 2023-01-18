import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgUnlinkChainAccountDetails from './MsgUnlinkChainAccountDetails';
import MsgUnlinkChainAccountListItem from './MsgUnllinkChainAccountListItem';

const MsgUnlinkChainAccountComponents: MessageComponents<MsgUnlinkChainAccountEncodeObject> = {
  details: MsgUnlinkChainAccountDetails,
  listItem: MsgUnlinkChainAccountListItem,
};

export default MsgUnlinkChainAccountComponents;
