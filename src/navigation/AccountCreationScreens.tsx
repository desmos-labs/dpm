import React from 'react';
import CheckMnemonic from '../screens/AccountCreation/CheckMnemonic';
import GenerateAccount from '../screens/AccountCreation/GenerateAccount';
import GenerateNewMnemonic from '../screens/AccountCreation/GenerateNewMnemonic';
import ImportRecoveryPassphrase from '../screens/AccountCreation/ImportRecoveryPassphrase';
import Login from '../screens/AccountCreation/Login';
import { PickDerivationPath } from '../screens/AccountCreation/PickDerivationPath';
import WalletPassword from '../screens/AccountCreation/WalletPassword';
import { AccountCreationStack } from '../types/navigation';

export default function AccountCreationScreens() {
  return (
    <AccountCreationStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountCreationStack.Screen name="Login" component={Login} />
      <AccountCreationStack.Screen name="GenerateNewMnemonic" component={GenerateNewMnemonic} />
      <AccountCreationStack.Screen name="CheckMnemonic" component={CheckMnemonic} />
      <AccountCreationStack.Screen name="PickDerivationPath" component={PickDerivationPath} />
      <AccountCreationStack.Screen
        name="ImportRecoveryPassphrase"
        component={ImportRecoveryPassphrase}
      />
      <AccountCreationStack.Screen name="CreateWalletPassword" component={WalletPassword} />
      <AccountCreationStack.Screen name="CheckWalletPassword" component={WalletPassword} />
      <AccountCreationStack.Screen name="GenerateAccount" component={GenerateAccount} />
    </AccountCreationStack.Navigator>
  );
}
