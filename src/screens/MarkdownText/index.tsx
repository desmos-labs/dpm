import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import RNFS from 'react-native-fs';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';
import { RootStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useStyles from './useStyles';

export type Props = StackScreenProps<RootStackParams, 'MarkdownText'>;

const MarkdownText: React.FC<Props> = (props) => {
  const {
    route: {
      params: { text, title, asset },
    },
  } = props;
  const [content, setContent] = useState(text ?? '');
  const theme = useTheme();
  const styles = useStyles();

  useEffect(() => {
    if (asset !== undefined) {
      (async () => {
        const textToRender =
          Platform.OS === 'android'
            ? await RNFS.readFileAssets(asset).catch((e) => console.error(e))
            : await RNFS.readFile(`${RNFS.MainBundlePath}${asset}`).catch((e) => console.error(e));
        if (textToRender) {
          setContent(textToRender);
        }
      })();
    }
  }, [asset]);

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} capitalizeTitle={false} title={title} />}
      scrollable
    >
      <View onStartShouldSetResponder={() => true} style={styles.content}>
        <ScrollView>
          <Markdown
            style={{
              body: {
                fontFamily: 'Poppins-Regular',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '400',
                color: theme.colors.font['1'],
              },
              heading1: { fontFamily: 'Poppins-Bold', fontSize: 22 },
              heading2: {
                fontFamily: 'Poppins-Bold',
                fontSize: 18,
                fontStyle: 'normal',
                fontWeight: '500',
                color: theme.colors.font['1'],
              },
            }}
          >
            {content}
          </Markdown>
        </ScrollView>
      </View>
    </StyledSafeAreaView>
  );
};

export default MarkdownText;
