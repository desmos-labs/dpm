import React from 'react';
import { ConnectChain } from '../screens/ChainLink/ConnectChain';
import { LinkWithMnemonic } from '../screens/ChainLink/LinkWithMnemonic';
import { PickAddress } from '../screens/ChainLink/PickAddress';
import { SelectChain } from '../screens/ChainLink/SelectChain';
import { SelectLedgerApp } from '../screens/ChainLink/SelectLedgerApp';
import { ChainLinkScreensStack } from '../types/navigation';

const ChainLinkScreens: React.FC = () => (
  <ChainLinkScreensStack.Navigator
    initialRouteName="ConnectChain"
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChainLinkScreensStack.Screen name="ConnectChain" component={ConnectChain} />
    <ChainLinkScreensStack.Screen name="SelectChain" component={SelectChain} />
    <ChainLinkScreensStack.Screen name="SelectLedgerApp" component={SelectLedgerApp} />
    <ChainLinkScreensStack.Screen name="LinkWithMnemonic" component={LinkWithMnemonic} />
    <ChainLinkScreensStack.Screen name="PickAddress" component={PickAddress} />
  </ChainLinkScreensStack.Navigator>
);

export default ChainLinkScreens;
