import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import Button from 'components/Button';
import LightTheme from 'config/theme/LightTheme';
import DarkTheme from 'config/theme/DarkTheme';
import { ThemeProvider } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.COMPONENTS_DEMO>;

/**
 * Dev screen to showcase the components styles.
 */
const ComponentsDemo: React.FC<NavProps> = (props) => {
  const styles = useStyles();

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <ScrollView>
        <Typography.Subtitle>Light Buttons</Typography.Subtitle>
        <ThemeProvider theme={LightTheme}>
          <Typography.Caption>Primary</Typography.Caption>
          {/* Outlined Buttons */}
          <View style={styles.inline}>
            <Button mode={'outlined'} onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} loading onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} disabled onPress={() => {}}>
              Outlined
            </Button>
          </View>

          {/* Text Buttons */}
          <View style={styles.inline}>
            <Button mode={'text'} onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} loading onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} disabled onPress={() => {}}>
              Text
            </Button>
          </View>

          {/* Contained Buttons */}
          <View style={styles.inline}>
            <Button mode={'contained'} onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} loading onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} disabled onPress={() => {}}>
              Contained
            </Button>
          </View>

          {/* accent button */}
          <Typography.Caption>Accent</Typography.Caption>
          {/* Outlined Buttons */}
          <View style={styles.inline}>
            <Button mode={'outlined'} accent onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} loading accent onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} disabled accent onPress={() => {}}>
              Outlined
            </Button>
          </View>

          {/* Text Buttons */}
          <View style={styles.inline}>
            <Button mode={'text'} accent onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} loading accent onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} disabled accent onPress={() => {}}>
              Text
            </Button>
          </View>

          {/* Contained Buttons */}
          <View style={styles.inline}>
            <Button mode={'contained'} accent onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} loading accent onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} disabled accent onPress={() => {}}>
              Contained
            </Button>
          </View>
        </ThemeProvider>

        <Typography.Subtitle>Dark Buttons</Typography.Subtitle>
        <ThemeProvider theme={DarkTheme}>
          <Typography.Caption>Primary</Typography.Caption>
          {/* Outlined Buttons */}
          <View style={styles.inline}>
            <Button mode={'outlined'} onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} loading onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} disabled onPress={() => {}}>
              Outlined
            </Button>
          </View>

          {/* Text Buttons */}
          <View style={styles.inline}>
            <Button mode={'text'} onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} loading onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} disabled onPress={() => {}}>
              Text
            </Button>
          </View>

          {/* Contained Buttons */}
          <View style={styles.inline}>
            <Button mode={'contained'} onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} loading onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} disabled onPress={() => {}}>
              Contained
            </Button>
          </View>

          {/* accent button */}
          <Typography.Caption>Accent</Typography.Caption>
          {/* Outlined Buttons */}
          <View style={styles.inline}>
            <Button mode={'outlined'} accent onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} loading accent onPress={() => {}}>
              Outlined
            </Button>
            <Button mode={'outlined'} disabled accent onPress={() => {}}>
              Outlined
            </Button>
          </View>

          {/* Text Buttons */}
          <View style={styles.inline}>
            <Button mode={'text'} accent onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} loading accent onPress={() => {}}>
              Text
            </Button>
            <Button mode={'text'} disabled accent onPress={() => {}}>
              Text
            </Button>
          </View>

          {/* Contained Buttons */}
          <View style={styles.inline}>
            <Button mode={'contained'} accent onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} loading accent onPress={() => {}}>
              Contained
            </Button>
            <Button mode={'contained'} disabled accent onPress={() => {}}>
              Contained
            </Button>
          </View>
        </ThemeProvider>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default ComponentsDemo;
