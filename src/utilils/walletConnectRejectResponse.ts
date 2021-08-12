import {ClientTypes, SessionTypes} from '@walletconnect/types';

const DEFAULT_MSG = 'User rejected JSON-RPC request';

export default function walletConnectRejectResponse(
    request: SessionTypes.RequestEvent,
    msg: string = DEFAULT_MSG,
): ClientTypes.RespondParams {
    return {
        topic: request.topic,
        response: {
            id: request.request.id,
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: msg,
            },
        },
    };
}
