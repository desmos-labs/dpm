import { MsgDeleteReportEncodeObject } from '@desmoslabs/desmjs';
import { MessageComponents } from 'components/Messages/BaseMessage';
import MsgDeleteReportListItem from './MsgDeleteReportListItem';
import MsgDeleteReportDetails from './MsgDeleteReportDetails';

const MsgDeleteReportComponents: MessageComponents<MsgDeleteReportEncodeObject> = {
  listItem: MsgDeleteReportListItem,
  details: MsgDeleteReportDetails,
};

export default MsgDeleteReportComponents;
