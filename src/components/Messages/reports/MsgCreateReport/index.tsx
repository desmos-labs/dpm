import { MsgCreateReportEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgCreateReportListItem from './MsgCreateReportListItem';
import MsgCreateReportDetails from './MsgCreateReportDetails';

const MsgCreateReportComponents: MessageComponents<MsgCreateReportEncodeObject> = {
  listItem: MsgCreateReportListItem,
  details: MsgCreateReportDetails,
};

export default MsgCreateReportComponents;
