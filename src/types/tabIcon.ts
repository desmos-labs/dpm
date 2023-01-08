import { FC } from 'react';

export type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export type TabIconComponent = FC<TabIconProps>;
