import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
	AccountScreensStackParams,
	AirdropScreensStack,
} from '../types/navigation';
import { AirdropHome } from '../screens/Airdrop/AirdropHome';
import { AirdropAllocation } from '../screens/Airdrop/AirdropAllocation';
import { AirdropClaimStatus } from '../screens/Airdrop/AirdropClaimStatus';
import { AirdropClaimRewards } from '../screens/Airdrop/AirdropClaimRewards';
import { AirdropRequestFeeGrant } from '../screens/Airdrop/AirdropRequestFeeGrant';

export type Props = StackScreenProps<
	AccountScreensStackParams,
	'AirdropScreens'
>;

export const AirdropScreens: React.FC<Props> = () => {
	return (
		<AirdropScreensStack.Navigator
			initialRouteName="AirdropHome"
			screenOptions={{
				headerShown: false,
			}}
		>
			<AirdropScreensStack.Screen name="AirdropHome" component={AirdropHome} />
			<AirdropScreensStack.Screen
				name="AirdropAllocation"
				component={AirdropAllocation}
			/>
			<AirdropScreensStack.Screen
				name="AirdropClaimStatus"
				component={AirdropClaimStatus}
			/>
			<AirdropScreensStack.Screen
				name="AirdropRequestFeeGrant"
				component={AirdropRequestFeeGrant}
			/>
			<AirdropScreensStack.Screen
				name="AirdropClaimRewards"
				component={AirdropClaimRewards}
			/>
		</AirdropScreensStack.Navigator>
	);
};
