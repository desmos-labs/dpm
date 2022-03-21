import { useCallback, useState } from 'react';
import { useWalletConnectContext } from '../contexts/WalletConnectContext';

export type DisconnectionStatus = {
	disconnecting: boolean;
	disconnected?: boolean;
	error?: string;
};

/**
 * Hook to terminate a WalletConnect session.
 * Returns a stateful variable that provides the termination status and a function to terminate the session.
 */
export default function useWalletConnectDisconnect(): [
	DisconnectionStatus,
	(sessioId: string) => void
] {
	const { controller } = useWalletConnectContext();
	const [status, setStatus] = useState<DisconnectionStatus>({
		disconnecting: false,
	});

	const disconnect = useCallback(
		async (sessionId: string) => {
			setStatus({
				disconnecting: true,
			});
			try {
				await controller.terminateSession(sessionId);
				setStatus({
					disconnecting: false,
					disconnected: true,
				});
			} catch (e) {
				setStatus({
					disconnecting: false,
					error: e.toString(),
				});
			}
		},
		[controller]
	);

	return [status, disconnect];
}
