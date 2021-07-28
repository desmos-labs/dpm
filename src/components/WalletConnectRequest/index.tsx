import React from "react";
import {SessionTypes} from "@walletconnect/types";
import {Button, NativeSyntheticEvent, NativeTouchEvent, Text, View} from "react-native";
import {JsonRpcRequest} from "@json-rpc-tools/utils";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../../store/WalletConnectStore";
import useWalletConnectRequestApprove from "../../hooks/useWalletConnectRequestApprove";
import useWalletConnectRequestReject from "../../hooks/useWalletConnectRequestReject";

export interface ChainRequestRender {
    label: string;
    value: string;
}

export function getChainRequestRender(request: JsonRpcRequest): ChainRequestRender[] {
    let params = [{label: "Method", value: request.method}];
    console.log("jsonRpcRquestID", request.id);

    switch (request.method) {
        case "cosmos_signDirect":
            params = [
                ...params,
                {
                    label: "SignerAddress",
                    value: request.params.signerAddress,
                },
                {
                    label: "ChainId",
                    value: request.params.signDoc.chainId,
                },
                {
                    label: "AccountNumber",
                    value: request.params.signDoc.accountNumber,
                },
                {
                    label: "AuthInfo",
                    value: request.params.signDoc.authInfoBytes,
                },
                {
                    label: "Body",
                    value: request.params.signDoc.bodyBytes,
                },
            ];
            break;
        case "cosmos_signAmino":
            params = [
                ...params,
                {
                    label: "SignerAddress",
                    value: request.params.signerAddress,
                },
                {
                    label: "ChainId",
                    value: request.params.signDoc.chain_id,
                },
                {
                    label: "AccountNumber",
                    value: request.params.signDoc.account_number,
                },
                {
                    label: "Messages",
                    value: JSON.stringify(request.params.signDoc.msgs, null, "\t"),
                },
                {
                    label: "Sequence",
                    value: request.params.signDoc.sequence,
                },
                {
                    label: "Memo",
                    value: request.params.signDoc.memo,
                },
            ];
            break;
        default:
            params = [
                ...params,
                {
                    label: "params",
                    value: JSON.stringify(request.params, null, "\t"),
                },
            ];
            break;
    }
    return params;
}


export type Props = {
    request: SessionTypes.RequestEvent,
    onRequestHandled: (request: SessionTypes.RequestEvent) => void;
}

export default function WalletConnectRequest(props: Props): JSX.Element {

    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [approveStatus, approve] = useWalletConnectRequestApprove(client);
    const [rejectStatus, reject] = useWalletConnectRequestReject(client);

    const params = getChainRequestRender(props.request.request);

    const onRejectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        // Just to handle the case that the click on both the buttons
        if (approveStatus === null) {
            reject(props.request);
        }
    }

    const onApprovePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        // Just to handle the case that the click on both the buttons
        if (rejectStatus === null) {
            // TODO: Sign and approve the request.
        }
    }

    const onOkButtonPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        props.onRequestHandled(props.request);
    }

    if (rejectStatus !== null) {
        if (rejectStatus.isFulfilled()) {
            return <View>
                <Text>Request rejected</Text>
                <Button title={"Ok"} onPress={onOkButtonPressed}/>
            </View>
        } else if (rejectStatus.isPending()) {
            return <View><Text>Rejecting...</Text></View>
        } else {
            return <View><Text>Error while rejecting request</Text></View>
        }
    } else if (approveStatus !== null) {
        if (approveStatus.isFulfilled()) {
            return <View>
                <Text>Request approved</Text>
                <Button title={"Ok"} onPress={onOkButtonPressed}/>
            </View>
        } else if (approveStatus.isPending()) {
            return <View><Text>Approving...</Text></View>
        } else {
            return <View><Text>Error while approving request</Text></View>
        }
    } else {
        return <View>
            <Text>Request: {props.request.request.method.toString()}</Text>
            {params.map(param => {
                return <View key={param.label}>
                    <Text>Param {param.label}</Text>
                    <Text>Value {param.value}</Text>
                </View>
            })}

            <View>
                <Button title={"Approve"} onPress={onApprovePressed}/>
                <Button title={"Reject"} onPress={onRejectPressed}/>
            </View>
        </View>
    }
}