import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@desmoslabs/desmjs';
import { CosmosRPCMethods } from '@desmoslabs/desmjs-walletconnect-v2';
import { useMemo } from 'react';
import { WalletConnectRequest as Request } from 'types/walletConnect';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';

export const useRequestFields = () => {
  const requests = useAllWalletConnectSessionsRequests();

  const request: Request | undefined = useMemo(() => {
    if (requests.length > 0) {
      return requests[0];
    }
    return undefined;
  }, [requests]);

  const stdFee: StdFee | undefined = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return request.fee;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return request.fee;
    }
    return undefined;
  }, [request]);

  const memo = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return request.memo;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return request.memo;
    }
    return undefined;
  }, [request]);

  const messages: EncodeObject[] = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return request.msgs;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return request.msgs;
    }
    return [];
  }, [request]);

  return { request, stdFee, memo, messages };
};
