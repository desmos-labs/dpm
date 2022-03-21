import { useCallback } from 'react';
import { useWalletConnectContext } from '../contexts/WalletConnectContext';

/**
 * Hook that provides a function to reject a WalletConnect call request.
 */
export default function useWalletConnectRejectRequest() {
	const { controller, removeCallRequest } = useWalletConnectContext();

	return useCallback(
		(sessionId: string, requestId: number, message: string) => {
			controller.rejectRequest(sessionId, requestId, message);
			removeCallRequest(requestId);
		},
		[controller, removeCallRequest]
	);
}
