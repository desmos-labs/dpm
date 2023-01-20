import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage/index';

describe('MMKV custom serialization', () => {
  it('test Date serialization', () => {
    const testDate = new Date();
    setMMKV(MMKVKEYS.PROFILES, testDate);
    const reloadedDate = <Date>getMMKV(MMKVKEYS.PROFILES);

    expect(testDate).toEqual(reloadedDate);
  });

  it('test nested Date serialization', () => {
    const testObject = {
      date: new Date(),
    };
    setMMKV(MMKVKEYS.PROFILES, testObject);
    const reloadedDate = <typeof testObject>getMMKV(MMKVKEYS.PROFILES);

    expect(testObject.date).toEqual(reloadedDate.date);
  });

  it('test Uint8Array serialization', () => {
    const testArray = Uint8Array.from([1, 2, 3]);
    setMMKV(MMKVKEYS.PROFILES, testArray);
    const reloadedDate = <Date>getMMKV(MMKVKEYS.PROFILES);

    expect(testArray).toEqual(reloadedDate);
  });

  it('test nested Uint8Array serialization', () => {
    const testObject = {
      array: Uint8Array.from([1, 2, 3]),
    };
    setMMKV(MMKVKEYS.PROFILES, testObject);
    const reloadedDate = <typeof testObject>getMMKV(MMKVKEYS.PROFILES);

    expect(testObject.array).toEqual(reloadedDate.array);
  });
});
