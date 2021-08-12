import React, {useState} from "react";
import {
    Button,
    NativeSyntheticEvent,
    NativeTouchEvent,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {RootStackParams} from "../types/navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import {SessionTypes} from "@walletconnect/types";
import ProposalViewer from "../components/SessionProposal";
import useWalletConnectPair, {PairRequestStatus} from "../hooks/useWalletConnectPair";
import WalletConnectUriPair from "../components/WalletConnectUriPair";
import WalletConnectQRPair from "../components/WalletConnectQRPair";

type Props = StackScreenProps<RootStackParams, "NewWalletSession">;
export default function NewWalletSession(props: Props) {

    const {navigation} = props;
    const account = props.route.params.account;
    const [useUri, setUseUri] = useState(false);
    const walletConnect = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [pairStatus, pair, approve, reject] = useWalletConnectPair(walletConnect);

    const toggleUriQr = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        setUseUri(!useUri);
    }

    const onBackPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.goBack();
    }

    const onProposalApproved = (proposal: SessionTypes.Proposal) => {
        const response: SessionTypes.Response = {
            metadata: proposal.proposer.metadata,
            state: {
                accounts: [`desmos:${account.chainId}:${account.address}`],
            },
        };
        approve({
            proposal,
            response
        })
    }

    const onProposalRejected = (proposal: SessionTypes.Proposal) => {
        reject({
            proposal,
        })
    }

    if (pairStatus === null ||
        pairStatus.status === PairRequestStatus.Failed) {
        const message = pairStatus?.error;

        return <SafeAreaView style={styles.container}>
            <View style={{flex: 1}}>
                <Text>Account: {account.address}</Text>
                {message !== undefined && <Text>Error: {message}</Text>}
                {useUri ?
                    <WalletConnectUriPair onPairRequest={pair}/> :
                    <WalletConnectQRPair onPairRequest={pair}/>
                }
            </View>
            <Button title={useUri ? "Use QR" : "Use URI"} onPress={toggleUriQr}/>
        </SafeAreaView>
    } else {
        switch (pairStatus.status) {
            case PairRequestStatus.WaitingResponse:
            case PairRequestStatus.Approving:
                return <SafeAreaView style={styles.container}>
                    <Text>Loading...</Text>
                </SafeAreaView>;

            case PairRequestStatus.WaitingApprove:
                return <SafeAreaView style={styles.container}>
                    <ProposalViewer proposal={pairStatus.proposal}
                        onApproved={onProposalApproved}
                        onRejected={onProposalRejected}/>
                </SafeAreaView>

            case PairRequestStatus.Success:
                return <SafeAreaView style={styles.container}>
                    <Text>Pair success: {pairStatus.settled.topic}</Text>
                    <Button title={"Back"} onPress={onBackPressed}/>
                </SafeAreaView>
        }
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 8
    }
})