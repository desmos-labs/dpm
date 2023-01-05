import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { accountsAppState } from '@recoil/accounts';
import { useRecoilValue } from 'recoil';
import Typography from 'components/Typography';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const accounts = useRecoilValue(accountsAppState);

  const navigateToLandingPage = useCallback(() => {
    navigation.navigate({
      name: ROUTES.LANDING,
      params: undefined,
    });
  }, [navigation]);

  return (
    <StyledSafeAreaView>
      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>
      <Typography.H1>Account: {Object.keys(accounts).length}</Typography.H1>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
