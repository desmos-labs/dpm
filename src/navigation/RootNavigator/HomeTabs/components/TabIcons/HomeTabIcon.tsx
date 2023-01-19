import { TabIconComponent } from 'types/tabIcon';
import React from 'react';
import DesmosIcon from 'components/DesmosIcon';

const Home: TabIconComponent = ({ size, color }) => (
  <DesmosIcon name="home" size={size} color={color} />
);

export default Home;
