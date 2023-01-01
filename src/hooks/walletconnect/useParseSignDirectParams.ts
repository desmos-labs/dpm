import {CallRequest} from 'types/walletconnect';
import {CosmosSignDirectParams} from 'types/jsonRpCosmosc';
import Long from 'long';
import {AuthInfo, TxBody} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {fromHex} from '@cosmjs/encoding';

const useParseSignDirectParams = () => (request: CallRequest): CosmosSignDirectParams | null => {
  const param = request.params.length > 0 ? request.params[0] : undefined;
  const signAddress: string | undefined = param?.signerAddress;
  const signDoc: any | undefined = param?.signDoc;
  const chainId: string | undefined = signDoc?.chainId;
  const accountNumber: string | undefined = signDoc?.accountNumber;
  const authInfo: string | undefined = signDoc?.authInfoBytes;
  const body: string | undefined = signDoc?.bodyBytes;

  if (
    signAddress === undefined ||
    signDoc === undefined ||
    chainId === undefined ||
    accountNumber === undefined ||
    authInfo === undefined ||
    body === undefined
  ) {
    console.error(`Malformed sign direct ${JSON.stringify(request.params)}`);
    return null;
  }

  return {
    signerAddress: signAddress,
    signDoc: {
      chainId,
      accountNumber: Long.fromString(accountNumber, 16),
      authInfo: AuthInfo.decode(fromHex(authInfo)),
      body: TxBody.decode(fromHex(body)),
    },
  };
};

export default useParseSignDirectParams;
