/* Disable the no-undef lint as the ReactNativePaper namespace will be provided at runtime */
/* eslint-disable no-undef */
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export type TypographyComponentProps = React.ComponentProps<typeof Text>;

function createTextComponent(
  styleProvider: (theme: ReactNativePaper.Theme) => StyleProp<TextStyle>,
): React.FC<TypographyComponentProps> {
  return (props) => {
    const { style } = props;
    const theme = useTheme();
    const themeStyle = useMemo(() => styleProvider(theme), [theme]);

    const commonStyle = useMemo<StyleProp<TextStyle>>(
      () => ({
        color: theme.colors.font['1'],
      }),
      [theme],
    );

    return <Text {...props} style={StyleSheet.compose([commonStyle, themeStyle], style)} />;
  };
}

const Typography = {
  Body: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.0025,
    textAlign: 'left',
  })),
  Body1: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.005,
    textAlign: 'left',
  })),
  Caption: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.004,
    textAlign: 'left',
  })),
  Caption2: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0.004,
    textAlign: 'left',
  })),
  Title: createTextComponent(() => ({
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    fontSize: 22,
  })),
  Subtitle: createTextComponent(() => ({
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Subtitle2: createTextComponent(() => ({
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
    letterSpacing: 0.001,
    textAlign: 'left',
  })),
  H1: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 48,
    letterSpacing: 0.0025,
    textAlign: 'left',
  })),
  H2: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  H4: createTextComponent(() => ({
    fontFamily: 'Poppins-Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 32,
    letterSpacing: 0.0015,
  })),
};

export default Typography;
