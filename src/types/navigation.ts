import {createStackNavigator} from '@react-navigation/stack';
import {CachedDesmosProfile, ChainAccount} from './chain';
import {CosmosTx, SignedCosmosTx} from './tx';
import LocalWallet from "../wallet/LocalWallet";
import {EncodeObject} from "@cosmjs/proto-signing";
import {createDrawerNavigator} from "@react-navigation/drawer";
import React from "react";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {SessionRequestDetails} from "./walletconnect";

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
    Profile: undefined,
    Authorization: undefined,
    ScanQr: undefined,
}

export const HomeScreensBottomTabs = createBottomTabNavigator<HomeScreensBottomTabsParams>();

export type HomeScreensDrawerParams = {
    HomeScreen: undefined
}

export const HomeScreensDrawer = createDrawerNavigator<HomeScreensDrawerParams>()

export type AccountScreensStackParams = {
    HomeScreens: undefined,
    EditProfile: {
        account?: ChainAccount,
        profile?: CachedDesmosProfile | null,
        bio?: string
    },
    BiographyEditor: {
        bio?: string,
    },
    ConfirmProfileEdit: {
        account: ChainAccount,
        /**
         * Profile dtag.
         */
        dtag: string,
        /**
         * Profile nickname.
         */
        nickname?: string,
        /**
         * Profile biography.
         */
        bio?: string,
        /**
         * Remote URL to the profile cover picture.
         */
        coverPictureUrl?: string,
        /**
         * Local URI to the profile cover picture.
         * If the coverPictureUrl is undefined and
         * this field is defined, this file will be uploaded.
         */
        localCoverPictureUri?: string,
        /**
         * Remote URL to the profile picture.
         */
        profilePictureUrl?: string,
        /**
         * Local URI to the profile picture.
         * If the profilePictureUrl is undefined and
         * this field is defined this file will be uploaded.
         */
        localProfilePictureUri?: string
    },
    AuthorizeSession: {
        sessionRequestDetails: SessionRequestDetails;
    };
    WalletConnectCallRequest: undefined,
    SignTx: {
        address: string;
        tx: CosmosTx;
        onSigned: (navigation: any, signedTx: SignedCosmosTx) => void;
    },
    BroadcastTx: {
        signer: ChainAccount,
        msgs: EncodeObject [],
        onSuccess: () => void,
        onCancel: () => void,
    },
    UnlockWallet: {
        address: string
        resolve: (wallet: LocalWallet | null) => void,
        reject: (error: Error) => void
    }
};

export const AccountScreensStack = createStackNavigator<AccountScreensStackParams>();

export type ModalComponentProps<T> = {
    navigation: StackNavigationProp<RootStackParams>,
    params: T
}

export type ModalComponent<T> = React.FC<ModalComponentProps<T>>

export type RootStackParams = {
    SplashScreen: undefined,
    AccountCreationScreens: undefined,
    AccountScreens: undefined,
    ModalScreen: {
        component: ModalComponent<any>,
        params?: any
    },
}

export const RootStack = createStackNavigator<RootStackParams>()
