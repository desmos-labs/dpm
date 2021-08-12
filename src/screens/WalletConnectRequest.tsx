import React, {useEffect} from 'react';
import {
    Button,
    NativeSyntheticEvent,
    NativeTouchEvent,
    Text,
    View,
} from 'react-native';
import useWalletConnectRequestApprove from '../hooks/useWalletConnectRequestApprove';
import useWalletConnectRequestReject from '../hooks/useWalletConnectRequestReject';
import {
    CosmosMethod,
    CosmosSignAminoResult,
    CosmosSignDirectResult,
} from '../types/jsonRpCosmosc';
import {DeferredState} from '../types/defered';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../types/navigation';
import {CosmosTx} from '../types/tx';
import WalletConnectStore, {
    WalletConnectRequestEvent,
} from '../store/WalletConnectStore';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {useRecoilState} from 'recoil';

export type Props = StackScreenProps<RootStackParams, 'WalletConnectRequest'>;

function requestToSignTx(requestEvent: WalletConnectRequestEvent): CosmosTx {
    switch (requestEvent.request.method) {
        case CosmosMethod.SignAmino:
            return {
                method: CosmosMethod.SignAmino,
                tx: requestEvent.request.params.signDoc,
            };

        case CosmosMethod.SignDirect:
            return {
                method: CosmosMethod.SignDirect,
                tx: requestEvent.request.params.signDoc,
            };
    }
}

export default function WalletConnectRequest(props: Props): JSX.Element {
    const {navigation} = props;
    const [, setSessions] = useRecoilState(
        WalletConnectStore.sessionRequests,
    );
    const [approveStatus, approve] = useWalletConnectRequestApprove();
    const [rejectStatus, reject] = useWalletConnectRequestReject();

    useEffect(() => {
        if (props.route.params.signature !== undefined) {
            const {request} = props.route.params.request;
            const session = props.route.params.session;
            switch (request.method) {
                case CosmosMethod.SignDirect:
                    approve({
                        topic: session.topic,
                        response: {
                            id: request.id,
                            jsonrpc: '2.0',
                            result: {
                                signature: {
                                    signature: props.route.params.signature,
                                },
                                signed: {
                                    ...request.params.signDoc,
                                },
                            } as CosmosSignDirectResult,
                        },
                    });
                    break;

                case CosmosMethod.SignAmino:
                    approve({
                        topic: session.topic,
                        response: {
                            id: request.id,
                            jsonrpc: '2.0',
                            result: {
                                signature: {
                                    signature: props.route.params.signature,
                                },
                                signed: {
                                    ...request.params.signDoc,
                                },
                            } as CosmosSignAminoResult,
                        },
                    });
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.route.params.signature]);

    const onOkButtonPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        setSessions(sessions => {
            return sessions.filter(
                s =>
                    s.request.request.id !==
                    props.route.params.request.request.id,
            );
        });
        navigation.goBack();
    };

    const onRejectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        reject(props.route.params.request);
    };

    const onApprovePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: 'SignTx',
            params: {
                address:
                    props.route.params.request.request.params.signerAddress,
                tx: requestToSignTx(props.route.params.request),
                onSigned: (
                    navigation: StackNavigationProp<RootStackParams, 'SignTx'>,
                    signature: string,
                ) => {
                    navigation.navigate({
                        name: 'WalletConnectRequest',
                        params: {
                            ...props.route.params,
                            signature,
                        },
                        merge: true,
                    });
                },
            },
        });
    };

    if (rejectStatus !== null) {
        switch (rejectStatus.state()) {
            case DeferredState.Pending:
                return (
                    <View>
                        <Text>Rejecting...</Text>
                    </View>
                );
            case DeferredState.Completed:
                return (
                    <View>
                        <Text>Request rejected</Text>
                        <Button title={'Ok'} onPress={onOkButtonPressed} />
                    </View>
                );
            case DeferredState.Failed:
                return (
                    <View>
                        <Text>Error while rejecting request</Text>
                    </View>
                );
        }
    } else if (approveStatus !== null) {
        switch (approveStatus.state()) {
            case DeferredState.Pending:
                return <View>
                    <Text>Approving...</Text>
                </View>

            case DeferredState.Completed:
                return  <View>
                    <Text>Request approved</Text>
                    <Button title={'Ok'} onPress={onOkButtonPressed} />
                </View>
            

            case DeferredState.Failed:
                return <View>
                    <Text>Error while approving request</Text>
                </View>
        }
    } else {
        const requestMethod =
            props.route.params.request.request.method.toString();
        const requestParams = props.route.params.request.request.params;
        return <View>
            <Text>Request: {requestMethod}</Text>
            <Text>{JSON.stringify(requestParams)}</Text>
            <View>
                <Button title={'Approve'} onPress={onApprovePressed} />
                <Button title={'Reject'} onPress={onRejectPressed} />
            </View>
        </View>
    }
}
