import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

const ChainLinkContentLoader = () => (
  <ContentLoader height={42}>
    <Circle x={21} y={21} r={21} />
    <Rect x={48} width={160} height={20} />
    <Rect x={48} y={24} width={220} height={18} />
  </ContentLoader>
);

export default ChainLinkContentLoader;
