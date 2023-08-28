// Import the polyfilled URL instance to test the URL instance that is
// used in the application.
import 'react-native-url-polyfill/auto';
import {
  GenericActionUri,
  SendTokensActionUri,
  UriActionType,
  ViewProfileActionUri,
} from 'types/uri';
import { actionUriFromRecord } from 'lib/UriActions/index';
import { ChainType } from 'types/chains';
import { coin } from '@cosmjs/amino';

describe('UriActions', () => {
  it('parse GenericActionUri', () => {
    const params = {
      action: UriActionType.Generic,
      address: 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0',
      chain_type: ChainType.Testnet,
    };

    const parsedUri = actionUriFromRecord(params) as GenericActionUri;
    expect(parsedUri).toBeDefined();
    expect(parsedUri.type).toEqual(UriActionType.Generic);
    expect(parsedUri.address).toEqual(params.address);
    expect(parsedUri.chainType).toEqual(params.chain_type);
  });

  it('parse ViewProfileActionUri', () => {
    const params = {
      action: UriActionType.ViewProfile,
      address: 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0',
      chain_type: ChainType.Testnet,
    };

    const parsedUri = actionUriFromRecord(params) as ViewProfileActionUri;
    expect(parsedUri).toBeDefined();
    expect(parsedUri.type).toEqual(UriActionType.ViewProfile);
    expect(parsedUri.address).toEqual(params.address);
    expect(parsedUri.chainType).toEqual(params.chain_type);
  });

  it('parse SendTokensActionUri with amount', () => {
    const params = {
      action: UriActionType.SendTokens,
      address: 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0',
      chain_type: ChainType.Testnet,
      amount: '100000udaric',
    };

    const parsedAction = actionUriFromRecord(params) as SendTokensActionUri;
    expect(parsedAction).toBeDefined();
    expect(parsedAction.type).toEqual(UriActionType.SendTokens);
    expect(parsedAction.address).toEqual(params.address);
    expect(parsedAction.chainType).toEqual(params.chain_type);
    expect(parsedAction.amount).toEqual(coin(100000, 'udaric'));
  });

  it('parse SendTokensActionUri without amount', () => {
    const params = {
      action: UriActionType.SendTokens,
      address: 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0',
      chain_type: ChainType.Testnet,
    };

    const parsedAction = actionUriFromRecord(params) as SendTokensActionUri;
    expect(parsedAction).toBeDefined();
    expect(parsedAction.type).toEqual(UriActionType.SendTokens);
    expect(parsedAction.address).toEqual(params.address);
    expect(parsedAction.chainType).toEqual(params.chain_type);
    expect(parsedAction.amount).toBeUndefined();
  });
});
