import React from 'react';
import { ImageBackground, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export type Props = {
  onClaimPressed: () => void;
  visible: boolean;
  style?: StyleProp<ViewStyle>;
};

export const AirdropBanner: React.FC<Props> = ({ visible, style, onClaimPressed }) =>
  visible ? (
    <TouchableOpacity style={style} onPress={onClaimPressed}>
      <ImageBackground
        source={require('../assets/airdrop_claimable.png')}
        resizeMethod="resize"
        style={styles.backgroundImage}
      />
    </TouchableOpacity>
  ) : null;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});
