import {createStackNavigator} from '@react-navigation/stack';
import {ChainAccount} from './chain';
import LocalWallet from "../wallet/LocalWallet";
import {EncodeObject} from "@cosmjs/proto-signing";
import React from "react";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {SessionRequestDetails} from "./walletconnect";
import {StdFee} from "@cosmjs/amino";
import {NavigatorScreenParams} from "@react-navigation/native";
import {DesmosProfile} from "@desmoslabs/sdk-core";

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
        bio?: string
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
        localProfilePictureUri?: string
    },
    AuthorizeSession: {
        sessionRequestDetails: SessionRequestDetails;
    };
    SendToken: undefined
    ConfirmTx: {
        messages: EncodeObject[],
        fee: StdFee
        memo?: string
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
    AccountScreens: NavigatorScreenParams<AccountScreensStackParams>,
    ModalScreen: {
        component: ModalComponent<any>,
        params?: any
    },
}

export const RootStack = createStackNavigator<RootStackParams>()
