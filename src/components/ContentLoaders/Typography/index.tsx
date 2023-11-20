import { TextStyle } from 'react-native';
import React, { FC } from 'react';
import { Rect } from 'react-content-loader/native';
import {
  TypographyConfigBody,
  TypographyConfigBody1,
  TypographyConfigCaption,
  TypographyConfigCaption2,
  TypographyConfigH1,
  TypographyConfigH2,
  TypographyConfigH4,
  TypographyConfigRegular10,
  TypographyConfigRegular12,
  TypographyConfigRegular14,
  TypographyConfigRegular16,
  TypographyConfigSemiBold16,
  TypographyConfigSemiBold18,
  TypographyConfigSemiBold30,
  TypographyConfigSubtitle,
  TypographyConfigSubtitle2,
  TypographyConfigTitle,
} from 'components/Typography/config';
import ThemedContentLoader from 'components/ThemedContentLoader';

interface TypographyContentLoaderProps {
  width: string | number;
  height?: string | number;
}

function createComponent(textStyle: TextStyle): FC<TypographyContentLoaderProps> {
  return ({ width, height }) => (
    <ThemedContentLoader
      width={width}
      height={height ?? textStyle.lineHeight ?? textStyle.fontSize ?? 10}
    >
      <Rect y="6" height="100%" width="100%" />
    </ThemedContentLoader>
  );
}

const TypographyContentLoaders = {
  Body: createComponent(TypographyConfigBody),
  Body1: createComponent(TypographyConfigBody1),
  Caption: createComponent(TypographyConfigCaption),
  Caption2: createComponent(TypographyConfigCaption2),
  Title: createComponent(TypographyConfigTitle),
  Subtitle: createComponent(TypographyConfigSubtitle),
  Subtitle2: createComponent(TypographyConfigSubtitle2),
  H1: createComponent(TypographyConfigH1),
  H2: createComponent(TypographyConfigH2),
  H4: createComponent(TypographyConfigH4),
  // New styles
  Regular10: createComponent(TypographyConfigRegular10),
  Regular12: createComponent(TypographyConfigRegular12),
  Regular14: createComponent(TypographyConfigRegular14),
  Regular16: createComponent(TypographyConfigRegular16),
  SemiBold16: createComponent(TypographyConfigSemiBold16),
  SemiBold18: createComponent(TypographyConfigSemiBold18),
  SemiBold30: createComponent(TypographyConfigSemiBold30),
};

export default TypographyContentLoaders;
