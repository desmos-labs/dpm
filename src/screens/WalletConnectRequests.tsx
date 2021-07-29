import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";
import {SessionTypes} from "@walletconnect/types";
import WalletConnectRequest from "../components/WalletConnectRequest";


type Props = StackScreenProps<RootStackParams, "WalletConnectRequests">;
export default function WalletConnectRequests(props: Props): JSX.Element | null {

    const [requests, setRequest] = useRecoilState(WalletConnectStore.sessionRequests);

    useEffect(() => {
        if (requests.length === 0) {
            props.navigation.goBack()
        }
    }, [requests])

    const onRequestHandled = (request: SessionTypes.RequestEvent) => {
        setRequest(requests.filter(r => r.request.request.id !== request.request.id));
    }

    if (requests.length > 0) {
        const {request, session} = requests[0];
        console.log(requests);
        return <WalletConnectRequest requestEvent={request}
                                     session={session}
                                     key={request.request.id}
                                     onRequestHandled={onRequestHandled}

        />
    } else {
        return null;
    }
}