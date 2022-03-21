import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WalletConnectController } from '../walletconnect/WalletConnectController';
import {
	CallRequestEvent,
	CallRequestType,
	Events,
	ParsedCallRequest,
} from '../types/walletconnect';
import parseCallRequest from '../utilils/jsonRpcParse';
import AccountSource from '../sources/AccountSource';

type WalletConnectInitState = {
	initializing: boolean;
	initialized?: boolean;
	error?: string;
};

interface WalletConnectState {
	initState: WalletConnectInitState;
	initWalletConnect: () => void;
	controller: WalletConnectController;
	callRequests: ParsedCallRequest[];
	removeCallRequest: (requestId: number) => void;
}

// @ts-ignore
const WalletConnectContext = React.createContext<WalletConnectState>({});

export const WalletContextProvider: React.FC = ({ children }) => {
	const [initState, setInitState] = useState<WalletConnectInitState>({
		initializing: false,
	});
	const controller = useMemo(() => new WalletConnectController(), []);
	const [callRequests, setCallRequests] = useState<ParsedCallRequest[]>([]);

	const initWalletConnect = useCallback(() => {
		(async () => {
			setInitState({
				initializing: true,
			});
			try {
				await controller.init();
				setInitState({
					initializing: false,
					initialized: true,
				});
			} catch (e) {
				setInitState({
					initializing: false,
					error: e.toString(),
				});
				console.error('WalletConnectController init failed', e);
			}
		})();
	}, [controller]);

	const onCallRequest = useCallback(
		async (event: CallRequestEvent) => {
			if (event.request) {
				const parsed = parseCallRequest(event.request);
				if (parsed === null) {
					const { id, sessionId, method } = event.request;
					controller.rejectRequest(
						sessionId,
						id,
						`Invalid request method ${method}`
					);
				} else {
					if (parsed.type === CallRequestType.GetAccounts) {
						// Handle the get accounts request in the background
						// to provide to the dApp the account public key and address.
						const session = controller.sessions.find(
							(session) => session.id === event.sessionId
						);
						const response = [];
						if (session !== undefined) {
							for (let sessionAccount of session.accounts) {
								const chainAccount = await AccountSource.getAccount(
									sessionAccount
								);
								if (chainAccount !== null) {
									response.push({
										algo: chainAccount.signAlgorithm,
										address: chainAccount.address,
										pubkey: chainAccount.pubKey,
									});
								}
							}
						}
						controller.approveRequest(
							parsed.sessionId,
							parsed.requestId,
							response
						);
					} else {
						setCallRequests((old) => [...old, parsed]);
					}
				}
			}
		},
		[controller]
	);

	const removeCallRequest = useCallback((requestId: number) => {
		setCallRequests((oldRequest) =>
			oldRequest.filter((r) => r.requestId !== requestId)
		);
	}, []);

	useEffect(() => {
		controller.addListener(Events.OnCallRequest, onCallRequest);
		return () => {
			controller.removeListener(Events.OnCallRequest, onCallRequest);
		};
	}, [controller, onCallRequest]);

	return (
		<WalletConnectContext.Provider
			value={{
				initState,
				initWalletConnect,
				controller,
				callRequests,
				removeCallRequest,
			}}
		>
			{children}
		</WalletConnectContext.Provider>
	);
};

export const useWalletConnectContext = (): WalletConnectState =>
	React.useContext(WalletConnectContext);
