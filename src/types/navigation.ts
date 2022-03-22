import { createStackNavigator } from '@react-navigation/stack';
import { EncodeObject } from '@cosmjs/proto-signing';
import React, { MutableRefObject } from 'react';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StdFee } from '@cosmjs/amino';
import {
	CommonActions,
	NavigationAction,
	NavigatorScreenParams,
} from '@react-navigation/native';
import { DesmosProfile } from '@desmoslabs/sdk-core';
import { StackNavigationState } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { ChainLink } from './link';
import { BleLedger, LedgerApp } from './ledger';
import { SessionRequestDetails } from './walletconnect';
import LocalWallet from '../wallet/LocalWallet';
import { ChainAccount, LinkableChain } from './chain';
import { Wallet } from './wallet';

export type AccountCreationStackParams = {
	Login: undefined;
	GenerateNewMnemonic: undefined;
	ImportRecoveryPassphrase: undefined;
	CheckMnemonic: {
		mnemonic: string;
	};
	PickDerivationPath: {
		mnemonic?: string;
		ledgerTransport?: BluetoothTransport;
	};
	CreateWalletPassword: {
		wallet: Wallet;
		password?: string;
	};
	CheckWalletPassword: {
		password: string;
		wallet: Wallet;
	};
	GenerateAccount: {
		password: string;
		wallet: Wallet;
	};
};

export const AccountCreationStack =
	createStackNavigator<AccountCreationStackParams>();

export type HomeScreensBottomTabsParams = {
	Home: undefined;
	Authorization: undefined;
	ScanQr: undefined;
};

export const HomeScreensBottomTabs =
	createBottomTabNavigator<HomeScreensBottomTabsParams>();

export type AccountScreensStackParams = {
	HomeScreens: NavigatorScreenParams<HomeScreensBottomTabsParams>;
	Profile: undefined;
	EditProfile: {
		account?: ChainAccount;
		profile?: DesmosProfile | null;
		bio?: string | null;
		goBackTo?: string;
		feeGranter?: string;
	};
	BiographyEditor: {
		bio?: string;
	};
	ConfirmProfileEdit: {
		account: ChainAccount;
		/**
		 * The profile before modifications.
		 */
		oldProfile: Partial<DesmosProfile>;
		/**
		 * The profile created from the user.
		 */
		profile: DesmosProfile;
		/**
		 * Local URI to the new cover picture.
		 */
		localCoverPictureUri?: string;
		/**
		 * Local URI to the new profile picture.
		 */
		localProfilePictureUri?: string;
		/**
		 * Name of the route to go back to.
		 */
		goBackTo?: string;
		/**
		 * Address of the account that will pay for the transaction.
		 */
		feeGranter?: string;
	};
	AuthorizeSession: {
		sessionRequestDetails: SessionRequestDetails;
	};
	SendToken: undefined;
	ConfirmTx: {
		messages: EncodeObject[];
		fee: StdFee;
		memo?: string;
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
		successAction?: () => void;
	};
	TxDetails: {
		hash: string;
		messages: EncodeObject[];
		fee: StdFee;
		success: boolean;
		dateTime: Date;
		memo?: string;
	};
	WalletConnectCallRequest: undefined;
	AuthorizeOperation: {
		/**
		 * Address of the account that is requesting the operation.
		 * */
		address: string;
		/**
		 * True if should also returned the user wallet that is stored
		 * encrypted in the device memory
		 */
		provideWallet: boolean;
		/**
		 * Callback called if the user authorized
		 * the operation or cancel it.
		 */
		resolve: (result: AuthorizeOperationResolveParams) => void;
		/**
		 * Callback called if an error occur.
		 */
		reject: (error: Error) => void;
	};
	ChainLinkScreens: NavigatorScreenParams<ChainLinkScreensStackParams>;
	ChainLinkDetails: {
		chainLink: ChainLink;
	};
	AirdropScreens: undefined;
};

export type AuthorizeOperationResolveParams = {
	authorized: boolean;
	wallet: LocalWallet | null;
};

export const AccountScreensStack =
	createStackNavigator<AccountScreensStackParams>();

export enum ImportMode {
	Mnemonic,
	Ledger,
}

export type ChainLinkScreensStackParams = {
	ConnectChain: {
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
	SelectChain: {
		importMode: ImportMode;
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
	SelectLedgerApp: {
		chain: LinkableChain;
		ledgerApplications: LedgerApp[];
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
	LinkWithMnemonic: {
		importMode: ImportMode;
		chain: LinkableChain;
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
	ConfirmAddress: {
		importMode: ImportMode;
		chain: LinkableChain;
		mnemonic?: string;
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
	PickAddress: {
		importMode: ImportMode;
		chain: LinkableChain;
		ledgerTransport?: BluetoothTransport;
		ledgerApp?: LedgerApp;
		mnemonic?: string;
		feeGranter?: string;
		backAction?:
			| ((state: StackNavigationState<any>) => NavigationAction)
			| NavigationAction;
	};
};

export const ChainLinkScreensStack =
	createStackNavigator<ChainLinkScreensStackParams>();

export type AirdropScreensStackParams = {
	AirdropHome: undefined;
	AirdropAllocation: {
		address: string;
	};
	AirdropClaimStatus: {
		address: string;
	};
	AirdropRequestFeeGrant: {
		externalAddress: string;
		desmosAddress: string;
	};
	AirdropClaimRewards: {
		address: string;
	};
};

export const AirdropScreensStack =
	createStackNavigator<AirdropScreensStackParams>();

export type ConnectToLedgerScreensStackParams = {
	ScanForLedger: {
		ledgerApp: LedgerApp;
		onConnectionEstablished: (transport: BluetoothTransport) => void;
		autoClose?: boolean;
		onCancel?: () => void;
	};
	ConnectToLedger: {
		ledgerApp: LedgerApp;
		bleLedger: BleLedger;
		onConnectionEstablished: (transport: BluetoothTransport) => void;
		autoClose?: boolean;
		onCancel?: () => void;
	};
};

export const ConnectToLedgerScreensStack =
	createStackNavigator<ConnectToLedgerScreensStackParams>();

export type ModalComponentProps<T> = {
	navigation: StackNavigationProp<RootStackParams>;
	params: T;
};

export type ModalComponent<T> = React.FC<ModalComponentProps<T>>;

export type RootStackParams = {
	SplashScreen: undefined;
	AccountCreationScreens: undefined;
	AccountScreens: NavigatorScreenParams<AccountScreensStackParams>;
	ConnectToLedgerScreens: {
		ledgerApp: LedgerApp;
		onConnectionEstablished: (transport: BluetoothTransport) => void;
		/**
		 * If true closes the screen after connecting
		 * to the ledger.
		 */
		autoClose?: boolean;
		onCancel?: () => void;
	};
	ModalScreen: {
		component: ModalComponent<any>;
		navigationRef: MutableRefObject<
			StackNavigationProp<RootStackParams> | undefined
		>;
		params?: any;
	};
};

export const RootStack = createStackNavigator<RootStackParams>();

export const resetTo =
	(routeName: string) => (state: StackNavigationState<any>) => {
		const routeIndex = state.routes.findIndex(
			(item) => item.name === routeName
		);

		if (routeIndex >= 0) {
			const routes = state.routes.slice(0, routeIndex + 1);
			return CommonActions.reset({
				...state,
				routes,
				index: routes.length - 1,
			});
		}
		console.error(`Can't find route with name: ${routeName}`);
		return CommonActions.navigate({ name: routeName });
	};

export const insertAfter =
	(insertAfter: string, routeName: string, params: any) =>
	(state: StackNavigationState<any>) => {
		const routeIndex = state.routes.findIndex(
			(item) => item.name === insertAfter
		);

		if (routeIndex >= 0) {
			const routes = [
				...state.routes.slice(0, routeIndex + 1),
				{ name: routeName, params },
			];
			return CommonActions.reset({
				...state,
				routes,
				index: routes.length - 1,
			});
		}
		console.error(`Can't find route with name: ${insertAfter}`);
		return CommonActions.navigate({ name: routeName, params });
	};
