function getRandomIntPair(max: number): [number, number] {
	const first = Math.floor(Math.random() * max);
	let second = Math.floor(Math.random() * max);

	while (second === first) {
		second = Math.floor(Math.random() * max);
	}

	return [first, second];
}

/**
 * Shuffle an array of items in place.
 * @param array - The array to shuffle.
 * @param iteration - Number of shuffle iterations.
 */
export default function shuffleArray<T>(array: T[], iteration: number): T[] {
	if (iteration === 0 || array.length === 0) {
		return array;
	}

	for (let i = 0; i < iteration; i + 1) {
		const [first, second] = getRandomIntPair(array.length);
		const firstItem = array[first];
		array[first] = array[second];
		array[second] = firstItem;
	}

	return array;
}
