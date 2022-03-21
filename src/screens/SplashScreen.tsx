import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const SplashScreen: React.FC = () => {
	return (
		<ImageBackground
			style={styles.root}
			source={require('../assets/home-background-light.png')}
			resizeMode="cover"
		/>
	);
};

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default SplashScreen;
