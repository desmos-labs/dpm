export enum DAppPermissions {
	/**
	 * Permissions that allow the DApp to broadcast
	 * a transaction signed from the user.
	 */
	BroadcastSignedTx = 'BroadcastSignedTx',
	/**
	 * Permission to ask to sign a transaction.
	 */
	RequestTxSign = 'RequestTxSign',
}

/**
 * Type that represents a DApp session.
 */
export type DAppSession = {
	/**
	 * The id that identify this session.
	 */
	id: string;
	/**
	 * The DApp name.
	 */
	name: string;
	/**
	 * Remote uri to the  DApp icon.
	 */
	iconUri?: string;
	/**
	 * Date on which the session has been established.
	 */
	creationDate: Date;
	/**
	 * Permissions requested from the DApp.
	 */
	permissions: DAppPermissions[];
};
