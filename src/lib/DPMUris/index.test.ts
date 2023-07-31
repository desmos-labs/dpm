// Import the polyfilled URL instance to test the URL instance that is
// used in the application.
import 'react-native-url-polyfill/auto';
import { DPMUriType } from 'types/uri';
import parseDPMUri from 'lib/DPMUris/index';

describe('DPM Uris', () => {
  it('parse valid user address uri', () => {
    const testAddress = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
    const testUri = `dpm://${DPMUriType.UserAddress}/${testAddress}`;

    const parsedUri = parseDPMUri(testUri);
    expect(parsedUri?.type).toEqual(DPMUriType.UserAddress);
    expect(parsedUri?.address).toEqual(testAddress);
  });

  it('parse invalid user address uri', () => {
    const testAddress = 'desmos1sadsa';
    const testUri = `dpm://${DPMUriType.UserAddress}/${testAddress}`;

    const parsedUri = parseDPMUri(testUri);
    expect(parsedUri?.type).toBe(undefined);
  });
});
