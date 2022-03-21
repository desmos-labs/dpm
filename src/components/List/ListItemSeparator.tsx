import React from 'react';
import { StyleSheet, View } from 'react-native';

export const ListItemSeparator: React.FC = (_) => {
	return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
	separator: {
		height: 16,
	},
});
