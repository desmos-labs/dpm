import React from 'react';
import ConnectChain from 'screens/ConnectChain';
import LinkWithMnemonic from 'screens/LinkWithMnemonic';
import PickAddress from 'screens/PickAddress';
import SelectChain from 'screens/SelectChain';
import SelectLedgerApp from 'screens/SelectLedgerApp';
import { ChainLinkScreensStack } from 'types/navigation';

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
