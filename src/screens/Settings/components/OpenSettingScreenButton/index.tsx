import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import Flexible from 'components/Flexible';

interface OpenSettingScreenButtonProps {
  readonly title: string;
  readonly route: ROUTES;
}

const OpenSettingScreenButton = (props: OpenSettingScreenButtonProps) => {
  const navigation = useNavigation<any>();
  const { title, route } = props;

  const onClick = useCallback(() => {
    navigation.navigate(route);
  }, [navigation, route]);

  return <Flexible.SectionButton label={title} onPress={onClick} />;
};

export default OpenSettingScreenButton;
