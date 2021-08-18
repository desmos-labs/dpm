import WalletConnect, {CLIENT_EVENTS} from "@walletconnect/client";
import {useEffect, useState} from "react";
import {ClientTypes, SessionTypes} from "@walletconnect/types";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";

export enum PairRequestStatus {
    WaitingResponse,
    WaitingApprove,
    Approving,
    Success,
    Failed,
}

export type PairWaitingResponse = {
    status: PairRequestStatus.WaitingResponse
}

export type PairWaitingApproval = {
    status: PairRequestStatus.WaitingApprove,
    proposal: SessionTypes.Proposal
}

export type PairApproving = {
    status: PairRequestStatus.Approving,
    proposal: SessionTypes.Proposal
}

export type PairSuccess = {
    status: PairRequestStatus.Success,
    settled: SessionTypes.Settled,
}

export type PairFailed = {
    status: PairRequestStatus.Failed,
    error: string
}

export type PairStatus = PairWaitingResponse | PairWaitingApproval | PairApproving | PairSuccess | PairFailed

/**
 * Hook to handle the WalletConnect pair requests.
 * Returns a stateful variable that provides the pairing request status, a function to accept the pair request and a function
 * to reject the pair request.
 */
export default function useWalletConnectPair():
    [PairStatus | null, (uri: string) => void, (params: ClientTypes.ApproveParams) => void,
        (params: ClientTypes.RejectParams) => void] {

    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [pairStatus, setPairStatus] = useState<PairStatus | null>(null);

    // Subscribe to client proposals
    useEffect(() => {
        const proposal_listener = async (proposal: SessionTypes.Proposal) => {
            setPairStatus({
                status: PairRequestStatus.WaitingApprove,
                proposal: proposal
            })
        }

        client.on(CLIENT_EVENTS.session.proposal, proposal_listener);
        return () => {
            client.removeListener(CLIENT_EVENTS.session.proposal, proposal_listener);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pair = (uri: string) => {
        setPairStatus({status: PairRequestStatus.WaitingResponse})
        client.pair({uri})
            .catch(ex => {
                setPairStatus({
                    status: PairRequestStatus.Failed,
                    error: ex.toString(),
                })
            })
    }

    const approve = (params: ClientTypes.ApproveParams) => {
        setPairStatus({
            status: PairRequestStatus.Approving,
            proposal: params.proposal
        });

        client.approve(params).then(settled => {
            setPairStatus({
                status: PairRequestStatus.Success,
                settled
            })
        }).catch(error => {
            setPairStatus({
                status: PairRequestStatus.Failed,
                error: error.toString()
            })
        })
    }

    const reject = (params: ClientTypes.RejectParams) => {
        client.reject(params).finally(() => {
            setPairStatus(null);
        })
    }

    return [pairStatus, pair, approve, reject]
}