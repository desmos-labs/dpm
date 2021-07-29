import React from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, Text, View} from "react-native";
import {useRecoilValue} from "recoil";
import WalletConnectStore, {WalletConnectRequestEvent} from "../store/WalletConnectStore";
import useWalletConnectRequestApprove from "../hooks/useWalletConnectRequestApprove";
import useWalletConnectRequestReject from "../hooks/useWalletConnectRequestReject";
import {CosmosMethod, CosmosSignAminoResult, CosmosSignDirectResult} from "../types/jsonRpCosmosc";
import {SessionTypes} from "@walletconnect/types";

export type Props = {
    requestEvent: WalletConnectRequestEvent,
    session: SessionTypes.Settled,
    onRequestHandled: (request: WalletConnectRequestEvent) => void;
}

export default function WalletConnectRequest(props: Props): JSX.Element {

    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [approveStatus, approve] = useWalletConnectRequestApprove(client);
    const [rejectStatus, reject] = useWalletConnectRequestReject(client);

    const onRejectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        // Just to handle the case that the click on both the buttons
        if (approveStatus === null) {
            reject(props.requestEvent);
        }
    }

    const onApprovePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        // Just to handle the case that the click on both the buttons
        if (rejectStatus === null) {
            const {request} = props.requestEvent;
            switch (request.method) {

                case CosmosMethod.SignDirect:
                    approve({
                        topic: props.session.topic,
                        response: {
                            id: request.id,
                            jsonrpc: "2.0",
                            result: {
                                signature: {
                                    signature: "direct signature",
                                },
                                signed: {
                                    ...request.params.signDoc
                                }
                            } as CosmosSignDirectResult,
                        },
                    })
                    break;

                case CosmosMethod.SignAmino:
                    approve({
                        topic: props.session.topic,
                        response: {
                            id: request.id,
                            jsonrpc: "2.0",
                            result: {
                                signature: {
                                    signature: "amino signature",
                                },
                                signed: {
                                    ...request.params.signDoc
                                }
                            } as CosmosSignAminoResult,
                        },
                    })
                    break;
            }
        }
    }

    const onOkButtonPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        props.onRequestHandled(props.requestEvent);
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
            <Text>Request: {props.requestEvent.request.method.toString()}</Text>
            <Text>{JSON.stringify(props.requestEvent.request.params)}</Text>
            <View>
                <Button title={"Approve"} onPress={onApprovePressed}/>
                <Button title={"Reject"} onPress={onRejectPressed}/>
            </View>
        </View>
    }
}