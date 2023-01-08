import { TabIconComponent } from 'types/tabIcon';
import React from 'react';
import { Image } from 'react-native';

const ScanQr: TabIconComponent = ({ size }) => (
  <Image
    style={{ width: size, height: size }}
    resizeMode="contain"
    source={require('assets/images/scanQRButton.png')}
  />
);

export default ScanQr;
