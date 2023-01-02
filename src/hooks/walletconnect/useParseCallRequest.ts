import {CallRequest, CallRequestType, ParsedCallRequest} from 'types/walletConnect';
import {CosmosMethod} from 'types/jsonRpCosmosc';
import useParseSignDirectParams from './useParseSignDirectParams';
import useParseSignAminoParams from './useParseSignAminoParams';

const useParseCallRequest = () => {
  const parseSignDirectParams = useParseSignDirectParams();
  const parseSignAminoParams = useParseSignAminoParams();

  return (request: CallRequest): ParsedCallRequest | null => {
    if (request.method === CallRequestType.SignDirect.toString()) {
      const params = parseSignDirectParams(request);
      if (params === null) {
        console.error(`Error while parsing params of: ${CosmosMethod.SignDirect}`);
        return null;
      }
      return {
        type: CallRequestType.SignDirect,
        sessionId: request.sessionId,
        requestId: request.id,
        signerAddress: params.signerAddress,
        signDoc: params.signDoc,
      };
    }
    if (request.method === CallRequestType.SignAmino.toString()) {
      const params = parseSignAminoParams(request);
      if (params === null) {
        console.error(`Error while parsing params of: ${CosmosMethod.SignAmino}`);
        return null;
      }
      return {
        type: CallRequestType.SignAmino,
        sessionId: request.sessionId,
        requestId: request.id,
        signerAddress: params.signerAddress,
        signDoc: params.signDoc,
      };
    }
    if (request.method === CallRequestType.GetAccounts.toString()) {
      return {
        type: CallRequestType.GetAccounts,
        sessionId: request.sessionId,
        requestId: request.id,
      };
    }
    console.error(`Unknown request method: ${request.method}`);
    return null;
  };
};

export default useParseCallRequest;
