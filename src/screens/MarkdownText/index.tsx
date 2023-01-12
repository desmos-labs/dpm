import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { readAsset } from 'lib/FileUtils';
import TopBar from 'components/TopBar';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MARKDOWN_TEXT>;

export interface MarkdownTextProps {
  readonly title: string;
  readonly text?: string;
  readonly fileName?: string;
}

const MarkdownText = (props: NavProps) => {
  const { route } = props;
  const { params } = route;
  const { title, text, fileName } = params;

  const theme = useTheme();
  const styles = useStyles();

  const isAndroid = Platform.OS === 'android';
  const [content, setContent] = useState(text || '');

  const renderAsset = useCallback(async (asset: string) => {
    const textToRender = await readAsset(asset);
    if (textToRender) {
      setContent(textToRender);
    }
  }, []);

  useEffect(() => {
    if (fileName !== undefined) {
      const assetName = isAndroid ? `custom/${fileName}` : `/${fileName}`;
      renderAsset(assetName);
    }
  }, [fileName, isAndroid, renderAsset]);

  return (
    <StyledSafeAreaView
      scrollable
      topBar={<TopBar stackProps={props} titleStyle={styles.topBarTitle} title={title} />}
    >
      <View onStartShouldSetResponder={() => true} style={styles.content}>
        <ScrollView>
          <Markdown
            style={{
              body: {
                fontFamily: theme.fonts.regular.fontFamily,
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: theme.fonts.regular.fontWeight,
                color: theme.colors.text,
              },
              heading1: {
                fontFamily: theme.fonts.regular.fontFamily,
                fontSize: 22,
              },
              heading2: {
                fontFamily: theme.fonts.medium.fontFamily,
                fontSize: 18,
                fontStyle: 'normal',
                fontWeight: theme.fonts.medium.fontWeight,
                color: theme.colors.text,
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
