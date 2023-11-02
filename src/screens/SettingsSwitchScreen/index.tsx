import { StackScreenProps } from '@react-navigation/stack';
import Flexible from 'components/Flexible';
import Spacer from 'components/Spacer';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import useStyles from './useStyles';

export interface SettingsSwitchScreenProps {
  /**
   * Text that will be displayed in the top bar and
   * as a label for the toggle.
   */
  readonly title: string;
  /**
   * Description text that will be displayed above the
   * switch.
   */
  readonly description: string;
  /**
   * Initial setting value.
   */
  readonly intialValue: boolean;
  /**
   * Function to toggle the setting.
   */
  readonly toggleSetting: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_SWITCH_SCREEN>;

/**
 * Screen that display a switch with a detailed description about
 * what the switch does.
 */
const SettingsSwitchScreen: React.FC<NavProps> = (props) => {
  const { route } = props;
  const { title, description, intialValue, toggleSetting } = route.params;
  const styles = useStyles();
  const [settingValue, setSettingValue] = React.useState(intialValue);

  const onSwitchPress = React.useCallback(async () => {
    try {
      await toggleSetting();
      setSettingValue((currentValue) => !currentValue);
    } catch (e) {
      // Ingnored.
    }
  }, [toggleSetting]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={title} />}>
      <Typography.Regular16>{description}</Typography.Regular16>
      <Spacer paddingTop={16} />
      <Flexible.SectionSwitch
        style={styles.switch}
        title={title}
        label={title}
        value={settingValue}
        isDisabled={false}
        onPress={onSwitchPress}
      />
    </StyledSafeAreaView>
  );
};

export default SettingsSwitchScreen;
