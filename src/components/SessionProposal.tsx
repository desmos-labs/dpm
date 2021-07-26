import React from "react";
import {Button, Text, View} from "react-native";
import {SessionTypes} from "@walletconnect/types";

export type Props = {
    proposal: SessionTypes.Proposal,
    onApproved: (p: SessionTypes.Proposal) => void,
    onRejected: (p: SessionTypes.Proposal) => void,
}

export default function ProposalViewer(props: Props): JSX.Element | null {
    const {proposal} = props;

    return <>
        <Text>New proposal: {proposal.topic}</Text>
        <View style={{display: 'flex', flexDirection: 'row'}}>
            <Button title={"Approve"} onPress={() => props.onApproved(proposal)}/>
            <Button title={"Reject"} onPress={() => props.onRejected(proposal)}/>
        </View>
    </>
}