import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import Markdown from 'react-native-markdown-display';
import { StyledSafeAreaView, TopBar } from '../components';
import { RootStackParams } from '../types/navigation';

export type Props = StackScreenProps<RootStackParams, 'MarkdownText'>;

export const MarkdownText: React.FC<Props> = (props) => {
  const {
    route: {
      params: { text, title, asset },
    },
  } = props;
  const [content, setContent] = useState(text ?? '');

  useEffect(() => {
    if (asset !== undefined) {
      (async () => {
        const textToRender = await RNFS.readFileAssets(asset).catch((_) => console.log(_));
        if (textToRender) {
          setContent(textToRender);
        }
      })();
    }
  }, [asset]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={title} />}>
      <View onStartShouldSetResponder={() => true} style={styles.content}>
        <ScrollView>
          <Markdown
            style={{
              body: {
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '400',
              },
              heading1: { fontFamily: 'Poppins-Bold', fontSize: 22 },
              heading2: {
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                fontStyle: 'normal',
                fontWeight: '500',
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

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});
