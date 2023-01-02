import { Coin } from '@cosmjs/amino';
import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { CosmosSignAminoParams } from 'types/jsonRpCosmosc';
import { CallRequest } from 'types/walletConnect';

const useParseSignAminoParams = () => (request: CallRequest): CosmosSignAminoParams | null => {
  const param = request.params.length > 0 ? request.params[0] : undefined;
  const signAddress: string | undefined = param?.signerAddress;
  const signDoc: any | undefined = param?.signDoc;
  const chainId: string | undefined = signDoc?.chain_id;
  const accountNumber: string | undefined = signDoc?.account_number;
  const sequence: string | undefined = signDoc?.sequence;
  const memo: string = signDoc?.memo ?? '';
  const fee: any | undefined = signDoc?.fee;
  const gas: string | undefined = fee?.gas;
  const amount: (Coin | null)[] | undefined = fee?.amount?.map((coin: any) => {
    if (typeof coin?.denom === 'string' && typeof coin?.amount === 'string') {
      return coin as Coin;
    }
    return null;
  });
  const msgs: (AminoMsg | null)[] | undefined = signDoc?.msgs?.map((m: any) => {
    if (typeof m.type === 'string' && typeof m.value === 'object') {
      return {
        type: m.type,
        value: m.value,
      };
    }
    return null;
  });

  // Check validity
  if (
    signAddress === undefined ||
    signDoc === undefined ||
    chainId === undefined ||
    accountNumber === undefined ||
    sequence === undefined ||
    fee === undefined ||
    msgs === undefined ||
    msgs.indexOf(null) >= 0 ||
    gas === undefined ||
    amount === undefined ||
    amount.indexOf(null) >= 0
  ) {
    console.error(`Malformed sign amino ${JSON.stringify(request.params)}`);
    return null;
  }

  return {
    signerAddress: signAddress!,
    signDoc: {
      chain_id: chainId,
      account_number: accountNumber,
      sequence,
      fee: {
        amount: amount as Coin[],
        gas,
      },
      memo,
      msgs: msgs as AminoMsg[],
    },
  };
};


export default useParseSignAminoParams;
