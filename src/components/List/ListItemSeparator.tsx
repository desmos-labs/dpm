import React from 'react';
import { StyleSheet, View } from 'react-native';

const ListItemSeparator: React.FC = () => {
	return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
	separator: {
		height: 16,
	},
});

export default ListItemSeparator;
