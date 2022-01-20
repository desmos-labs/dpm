import {createStackNavigator} from '@react-navigation/stack';
import {ChainAccount, LinkableChain} from './chain';
import LocalWallet from "../wallet/LocalWallet";
import {EncodeObject} from "@cosmjs/proto-signing";
import React, {MutableRefObject} from "react";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {SessionRequestDetails} from "./walletconnect";
import {StdFee} from "@cosmjs/amino";
import {CommonActions, NavigationAction, NavigatorScreenParams} from "@react-navigation/native";
import {DesmosProfile} from "@desmoslabs/sdk-core";
import {ChainLink} from "./link";
import {StackNavigationState} from "@react-navigation/routers/lib/typescript/src/StackRouter";
import {BleLedger, LedgerApp} from "./ledger";
import BluetoothTransport from "@ledgerhq/react-native-hw-transport-ble";

export type AccountCreationStackParams = {
    Login: undefined;
    GenerateNewMnemonic: undefined;
    ImportRecoveryPassphrase: undefined;
    CheckMnemonic: {
        mnemonic: string
    };
    PickDerivationPath: {
        mnemonic: string,
    }
    CreateWalletPassword: {
        wallet: LocalWallet,
    };
    CheckWalletPassword: {
        password: string,
        wallet: LocalWallet,
    }
    GenerateAccount: {
        password: string,
        wallet: LocalWallet,
    };
};

export const AccountCreationStack = createStackNavigator<AccountCreationStackParams>();

export type HomeScreensBottomTabsParams = {
    Home: undefined,
    Authorization: undefined,
    ScanQr: undefined,
}

export const HomeScreensBottomTabs = createBottomTabNavigator<HomeScreensBottomTabsParams>();

export type AccountScreensStackParams = {
    HomeScreens: NavigatorScreenParams<HomeScreensBottomTabsParams>,
    Profile: undefined,
    EditProfile: {
        account?: ChainAccount,
        profile?: DesmosProfile | null,
        bio?: string,
        goBackTo?: string,
        feeGranter?: string
    },
    BiographyEditor: {
        bio?: string,
    },
    ConfirmProfileEdit: {
        account: ChainAccount,
        /**
         * The profile created from the user.
         */
        profile: DesmosProfile,
        /**
         * Local URI to the new cover picture.
         */
        localCoverPictureUri?: string,
        /**
         * Local URI to the new profile picture.
         */
        localProfilePictureUri?: string,
        /**
         * Name of the route to go back to.
         */
        goBackTo?: string,
        /**
         * Address of the account that will pay for the transaction.
         */
        feeGranter?: string
    },
    AuthorizeSession: {
        sessionRequestDetails: SessionRequestDetails;
    };
    SendToken: undefined
    ConfirmTx: {
        messages: EncodeObject[],
        fee: StdFee
        memo?: string,
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
        successAction?: () => void,
    },
    TxDetails: {
        hash: string,
        messages: EncodeObject[],
        fee: StdFee,
        success: boolean,
        dateTime: Date,
        memo?: string,
    },
    WalletConnectCallRequest: undefined,
    UnlockWallet: {
        address: string
        resolve: (wallet: LocalWallet | null) => void,
        reject: (error: Error) => void
    },
    ChainLinkScreens: NavigatorScreenParams<ChainLinkScreensStackParams>,
    ChainLinkDetails: {
        chainLink: ChainLink
    }
    AirdropScreens: undefined,
};

export const AccountScreensStack = createStackNavigator<AccountScreensStackParams>();

export enum ImportMode {
    Mnemonic,
    Ledger
}

export type ChainLinkScreensStackParams = {
    ConnectChain: {
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    SelectChain: {
        importMode: ImportMode,
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    SelectLedgerApp: {
        chain: LinkableChain,
        ledgerApplications: LedgerApp[]
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    LinkWithMnemonic: {
        importMode: ImportMode,
        chain: LinkableChain,
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    ScanForLedger: {
        chain: LinkableChain,
        ledgerApp: LedgerApp,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    ConnectToLedger: {
        chain: LinkableChain,
        ledgerApp: LedgerApp,
        bleLedger: BleLedger,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    ConfirmAddress: {
        importMode: ImportMode,
        chain: LinkableChain,
        mnemonic?: string,
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
    PickAddress: {
        importMode: ImportMode,
        chain: LinkableChain,
        ledgerTransport?: BluetoothTransport,
        ledgerApp?: LedgerApp,
        mnemonic?: string,
        feeGranter?: string,
        backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
    },
}

export const ChainLinkScreensStack = createStackNavigator<ChainLinkScreensStackParams>();

export type AirdropScreensStackParams = {
    AirdropHome: undefined,
    AirdropAllocation: {
        address: string,
    },
    AirdropClaimStatus: {
        address: string,
    },
    AirdropRequestFeeGrant: {
        externalAddress: string,
        desmosAddress: string,
    },
    AirdropClaimRewards: {
        address: string,
    }
}

export const AirdropScreensStack = createStackNavigator<AirdropScreensStackParams>()

export type ModalComponentProps<T> = {
    navigation: StackNavigationProp<RootStackParams>,
    params: T
}

export type ModalComponent<T> = React.FC<ModalComponentProps<T>>

export type RootStackParams = {
    SplashScreen: undefined,
    AccountCreationScreens: undefined,
    AccountScreens: NavigatorScreenParams<AccountScreensStackParams>,
    ModalScreen: {
        component: ModalComponent<any>,
        navigationRef: MutableRefObject<StackNavigationProp<RootStackParams> | undefined>,
        params?: any
    },
}

export const RootStack = createStackNavigator<RootStackParams>();

export const resetTo = (routeName: string) => (state: StackNavigationState<any>) => {
    const routeIndex = state.routes.findIndex(item => item.name === routeName);

    if (routeIndex >= 0) {
        const routes = state.routes.slice(0, routeIndex + 1);
        return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
        })
    } else {
        console.error("Can't find route with name: " + routeName);
        return CommonActions.navigate({name: routeName});
    }
}

export const insertAfter = (insertAfter: string, routeName: string, params: any) => (state: StackNavigationState<any>) => {
    const routeIndex = state.routes.findIndex(item => item.name === insertAfter);

    if (routeIndex >= 0) {
        const routes = [...state.routes.slice(0, routeIndex + 1), {name: routeName, params}];
        return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
        })
    } else {
        console.error("Can't find route with name: " + insertAfter);
        return CommonActions.navigate({name: routeName, params});
    }
}
