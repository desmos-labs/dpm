import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { AirdropAllocation } from '../screens/Airdrop/AirdropAllocation';
import { AirdropClaimRewards } from '../screens/Airdrop/AirdropClaimRewards';
import { AirdropClaimStatus } from '../screens/Airdrop/AirdropClaimStatus';
import { AirdropHome } from '../screens/Airdrop/AirdropHome';
import { AirdropRequestFeeGrant } from '../screens/Airdrop/AirdropRequestFeeGrant';
import { AccountScreensStackParams, AirdropScreensStack } from '../types/navigation';

export type Props = StackScreenProps<AccountScreensStackParams, 'AirdropScreens'>;

export const AirdropScreens: React.FC<Props> = () => (
  <AirdropScreensStack.Navigator
    initialRouteName="AirdropHome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <AirdropScreensStack.Screen name="AirdropHome" component={AirdropHome} />
    <AirdropScreensStack.Screen name="AirdropAllocation" component={AirdropAllocation} />
    <AirdropScreensStack.Screen name="AirdropClaimStatus" component={AirdropClaimStatus} />
    <AirdropScreensStack.Screen name="AirdropRequestFeeGrant" component={AirdropRequestFeeGrant} />
    <AirdropScreensStack.Screen name="AirdropClaimRewards" component={AirdropClaimRewards} />
  </AirdropScreensStack.Navigator>
);
