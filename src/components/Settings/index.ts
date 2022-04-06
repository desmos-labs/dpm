import { SettingsSection } from './SettingsSection';
import { SettingsRadioGroup } from './SettingsRadioGroup';
import { SettingsSwitch } from './SettingsSwitch';
import { SettingsText } from './SettingsText';
import { SettingsButton } from './SettingsButton';

const Settings = {
  SettingsSection,
  SettingsText,
  SettingsButton,
  SettingsSwitch,
  SettingsSelect: SettingsRadioGroup,
};

export default Settings;
