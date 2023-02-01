import { TextStyle } from 'react-native';
import React, { FC } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import {
  TypographyConfigBody,
  TypographyConfigBody1,
  TypographyConfigCaption,
  TypographyConfigCaption2,
  TypographyConfigH1,
  TypographyConfigH2,
  TypographyConfigH4,
  TypographyConfigSubtitle,
  TypographyConfigSubtitle2,
  TypographyConfigTitle,
} from 'components/Typography/config';

export interface TypographyContentLoaderProps {
  width: string | number;
  height?: string | number;
}

function createComponent(textStyle: TextStyle): FC<TypographyContentLoaderProps> {
  return ({ width, height }) => (
    <ContentLoader
      width={width}
      height={height ?? textStyle.lineHeight ?? textStyle.fontSize ?? 10}
    >
      <Rect y="6" height="100%" width="100%" />
    </ContentLoader>
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
};

export default TypographyContentLoaders;
