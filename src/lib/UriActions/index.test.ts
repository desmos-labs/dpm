// Import the polyfilled URL instance to test the URL instance that is
// used in the application.
import 'react-native-url-polyfill/auto';
import { UriActionType } from 'types/uri';
import { parseUriAction, uriFromUriAction } from 'lib/UriActions/index';

describe('UriActions', () => {
  it('parse valid user address uri', () => {
    const testAddress = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
    const testUri = `dpm://${UriActionType.UserAddress}/${testAddress}`;

    const parsedUri = parseUriAction(testUri);
    expect(parsedUri?.type).toEqual(UriActionType.UserAddress);
    expect(parsedUri?.address).toEqual(testAddress);
  });

  it('parse invalid user address uri', () => {
    const testAddress = 'desmos1sadsa';
    const testUri = `dpm://${UriActionType.UserAddress}/${testAddress}`;

    const parsedUri = parseUriAction(testUri);
    expect(parsedUri?.type).toBe(undefined);
  });

  it('generate user address uri correctly', () => {
    const testAddress = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';

    const url = uriFromUriAction({
      type: UriActionType.UserAddress,
      address: testAddress,
    });
    expect(url).toBe(`dpm://${UriActionType.UserAddress}/${testAddress}`);
  });
});
