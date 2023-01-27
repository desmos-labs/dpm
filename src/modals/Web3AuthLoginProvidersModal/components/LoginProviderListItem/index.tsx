import React, { FC, useMemo } from 'react';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { Image, TouchableOpacity } from 'react-native';
import { applicationsIconsMap, domainApplicationIcon } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { capitalize } from 'lib/FormatUtils';
import useStyles from './useStyles';

export interface LoginProviderListItemProps {
  loginProvider: Web3AuthLoginProvider;
  onPress?: () => void;
}

const LoginProviderListItem: FC<LoginProviderListItemProps> = ({ loginProvider, onPress }) => {
  const styles = useStyles();
  const itemText = useMemo(() => capitalize(loginProvider), [loginProvider]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        style={styles.icon}
        source={applicationsIconsMap[loginProvider] ?? domainApplicationIcon}
        resizeMode={'contain'}
      />
      <Spacer paddingHorizontal={4} />
      <Typography.Caption>{itemText}</Typography.Caption>
    </TouchableOpacity>
  );
};

export default LoginProviderListItem;
