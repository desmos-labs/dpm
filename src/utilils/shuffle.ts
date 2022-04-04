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
  const shuffledArray = JSON.parse(JSON.stringify(array));
  if (iteration === 0 || shuffledArray.length === 0) {
    return shuffledArray;
  }

  for (let i = 0; i < iteration; i += 1) {
    const [first, second] = getRandomIntPair(shuffledArray.length);
    const firstItem = shuffledArray[first];
    shuffledArray[first] = shuffledArray[second];
    shuffledArray[second] = firstItem;
  }

  return shuffledArray;
}
