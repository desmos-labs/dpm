import ContentLoader, { IContentLoaderProps } from 'react-content-loader/native';
import { useTheme } from 'react-native-paper';
import React from 'react';

const ThemedContentLoader: React.FC<IContentLoaderProps> = (props: IContentLoaderProps) => {
  const theme = useTheme();

  return (
    <ContentLoader
      {...props}
      backgroundColor={theme.colors.activityIndicator.background}
      foregroundColor={theme.colors.activityIndicator.foreground}
    />
  );
};

export default ThemedContentLoader;
