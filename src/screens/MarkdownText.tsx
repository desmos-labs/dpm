import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import Markdown from 'react-native-markdown-display';
import { StyledSafeAreaView, TopBar } from '../components';
import { RootStackParams } from '../types/navigation';

export type Props = StackScreenProps<RootStackParams, 'MarkdownText'>;

export const MarkdownText: React.FC<Props> = (props) => {
  const { title, text, asset } = props.route.params;
  const [content, setContent] = useState(text ?? '');

  useEffect(() => {
    if (asset !== undefined) {
      (async () => {
        const t = await RNFS.readFileAssets('privacy.md').catch((_) => console.log(_));
        if (t) {
          setContent(t);
        }
      })();
    }
  }, [asset]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={title} />}>
      <View onStartShouldSetResponder={() => true} style={styles.content}>
        <ScrollView>
          <Markdown>{content}</Markdown>
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
