/* Disable the no-undef lint as the ReactNativePaper namespace will be provided at runtime */
/* eslint-disable no-undef */
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  TypographyConfigBody,
  TypographyConfigBody1,
  TypographyConfigCaption,
  TypographyConfigCaption2,
  TypographyConfigH1,
  TypographyConfigH2,
  TypographyConfigH4,
  TypographyConfigH5,
  TypographyConfigH6,
  TypographyConfigRegular10,
  TypographyConfigRegular12,
  TypographyConfigRegular14,
  TypographyConfigRegular16,
  TypographyConfigSemiBold10,
  TypographyConfigSemiBold14,
  TypographyConfigSemiBold16,
  TypographyConfigSemiBold18,
  TypographyConfigSemiBold20,
  TypographyConfigSemiBold30,
  TypographyConfigSubtitle,
  TypographyConfigSubtitle2,
  TypographyConfigTitle,
} from './config';

export type TypographyComponentProps = React.ComponentProps<typeof Text> & {
  capitalize?: boolean;
};

function createTextComponent(
  styleProvider: (theme: ReactNativePaper.Theme) => TextStyle,
): React.FC<TypographyComponentProps> {
  return (props) => {
    const { style } = props;
    const theme = useTheme();
    const themeStyle = useMemo(() => styleProvider(theme), [theme]);

    const commonStyle = useMemo<TextStyle>(
      () => ({
        color: theme.colors.font['1'],
        textTransform: props.capitalize ? 'capitalize' : undefined,
      }),
      [props.capitalize, theme.colors.font],
    );

    return <Text {...props} style={StyleSheet.compose([commonStyle, themeStyle], style)} />;
  };
}

const Typography = {
  Body: createTextComponent(() => TypographyConfigBody),
  Body1: createTextComponent(() => TypographyConfigBody1),
  Caption: createTextComponent(() => TypographyConfigCaption),
  Caption2: createTextComponent(() => TypographyConfigCaption2),
  Title: createTextComponent(() => TypographyConfigTitle),
  Subtitle: createTextComponent(() => TypographyConfigSubtitle),
  Subtitle2: createTextComponent(() => TypographyConfigSubtitle2),
  H1: createTextComponent(() => TypographyConfigH1),
  H2: createTextComponent(() => TypographyConfigH2),
  H4: createTextComponent(() => TypographyConfigH4),
  H5: createTextComponent(() => TypographyConfigH5),
  H6: createTextComponent(() => TypographyConfigH6),
  // New styles
  Regular10: createTextComponent(() => TypographyConfigRegular10),
  Regular12: createTextComponent(() => TypographyConfigRegular12),
  Regular14: createTextComponent(() => TypographyConfigRegular14),
  Regular16: createTextComponent(() => TypographyConfigRegular16),
  SemiBold10: createTextComponent(() => TypographyConfigSemiBold10),
  SemiBold14: createTextComponent(() => TypographyConfigSemiBold14),
  SemiBold16: createTextComponent(() => TypographyConfigSemiBold16),
  SemiBold18: createTextComponent(() => TypographyConfigSemiBold18),
  SemiBold20: createTextComponent(() => TypographyConfigSemiBold20),
  SemiBold30: createTextComponent(() => TypographyConfigSemiBold30),
};

export default Typography;
