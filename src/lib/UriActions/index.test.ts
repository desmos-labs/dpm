// Import the polyfilled URL instance to test the URL instance that is
// used in the application.
import 'react-native-url-polyfill/auto';
import { GenericActionUri, UriActionType } from 'types/uri';
import { parseUriAction, uriFromUriAction } from 'lib/UriActions/index';
import { ChainType } from 'types/chains';

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

  it('parse valid generic uri', () => {
    const testAddress = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
    const testChainId = 'testnet';
    const testUri = `dpm://?address=${testAddress}&chain_id=${testChainId}`;

    const parsedUri = parseUriAction(testUri) as GenericActionUri;
    expect(parsedUri).toBeDefined();
    expect(parsedUri.type).toEqual(UriActionType.Generic);
    expect(parsedUri.address).toEqual(testAddress);
    expect(parsedUri.chainId).toEqual(testChainId);
  });

  it('generate generic uri correctly', () => {
    const testAddress = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
    const testChainId = ChainType.Testnet;

    const action = uriFromUriAction({
      type: UriActionType.Generic,
      address: testAddress,
      chainId: testChainId,
    });
    expect(action).toBe(`dpm://?address=${testAddress}&chain_id=${testChainId}`);
  });
});
