import React from 'react';
import CheckMnemonic from 'screens/CheckMnemonic';
import GenerateAccount from 'screens/GenerateAccount';
import GenerateNewMnemonic from 'screens/GenerateNewMnemonic';
import ImportRecoveryPassphrase from 'screens/ImportRecoveryPassphrase';
import Legal from 'screens/Legal';
import Landing from 'screens/Landing';
import SelectAddress from 'screens/SelectAddress';
import WalletPassword from 'screens/CheckWalletPassword';
import { AccountCreationStack } from 'types/navigation';

const AccountCreationScreens = () => {
  return (
    <AccountCreationStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountCreationStack.Screen name="Login" component={Landing} />
      <AccountCreationStack.Screen name="Legal" component={Legal} />
      <AccountCreationStack.Screen name="GenerateNewMnemonic" component={GenerateNewMnemonic} />
      <AccountCreationStack.Screen name="CheckMnemonic" component={CheckMnemonic} />
      <AccountCreationStack.Screen name="PickDerivationPath" component={SelectAddress} />
      <AccountCreationStack.Screen
        name="ImportRecoveryPassphrase"
        component={ImportRecoveryPassphrase}
      />
      <AccountCreationStack.Screen name="CreateWalletPassword" component={WalletPassword} />
      <AccountCreationStack.Screen name="CheckWalletPassword" component={WalletPassword} />
      <AccountCreationStack.Screen name="GenerateAccount" component={GenerateAccount} />
    </AccountCreationStack.Navigator>
  );
};

export default AccountCreationScreens;
