import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { MnemonicWordBadge } from 'components/MnemonicWordBadge';
import useStyles from './useStyles';

export type MnemonicGridProps = {
  /**
   * The mnemonic that will be displayed.
   */
  mnemonic: string;
  style?: StyleProp<ViewStyle>;
};

const MnemonicGrid: React.FC<MnemonicGridProps> = (props) => {
  const { mnemonic, style } = props;
  const styles = useStyles();

  const words = useMemo(() => mnemonic.split(' '), [mnemonic]);
  const wordMatrix = useMemo(() => {
    const lines = words.length / 3;
    const matrix: string[][] = [];
    for (let l = 0; l < lines; l += 1) {
      const start = 3 * l;
      const end = 3 * (l + 1);
      matrix.push(words.slice(start, end));
    }
    return matrix;
  }, [words]);

  const renderRow = useCallback(
    (info: ListRenderItemInfo<string[]>) => {
      const row = info.item;
      const rowIndex = info.index;
      return (
        <View style={styles.row}>
          {row.map((w, index) => {
            const wordIndex = rowIndex * 3 + index + 1;
            return (
              <MnemonicWordBadge
                key={`word-${wordIndex}`}
                style={styles.word}
                value={w}
                index={wordIndex}
              />
            );
          })}
        </View>
      );
    },
    [styles.row, styles.word],
  );

  return (
    <View style={StyleSheet.compose(style, styles.root)}>
      <FlatList
        data={wordMatrix}
        renderItem={renderRow}
        keyExtractor={(item, index) => `row-${index}`}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

export default MnemonicGrid;
