import {createStackNavigator} from '@react-navigation/stack';
import ChainAccount from './chainAccount';
import {WalletConnectRequestEvent} from '../store/WalletConnectStore';
import {CosmosTx, SignedCosmosTx} from './tx';
import {SessionTypes} from '@walletconnect/types';
import {HdPath} from "./hdpath";
import {DesmosProfile} from "@desmoslabs/sdk-core";
import {ReactNode} from "react";
import LocalWallet from "../wallet/LocalWallet";

export type AccountConfig = {
    name: string;
    mnemonic: string;
    password: string;
    hdPath: HdPath
};

export type AccountCreationStackParams = {
    AccountCreation: undefined;
    GenerateNewMnemonic: undefined;
    CheckMnemonic: AccountConfig;
    ImportAccount: undefined;
    CreateWalletPassword: AccountConfig;
    GenerateAccountKeys: AccountConfig;
};

export const AccountCreationStack = createStackNavigator<AccountCreationStackParams>();

export type AccountScreensStackParams = {
    Account: undefined,
    EditProfile: {
        account: ChainAccount,
        currentProfile: DesmosProfile | null,
    },
    AccountSessions: {
        account: ChainAccount;
    };
    NewWalletSession: {
        account: ChainAccount;
    };
    WalletConnectRequests: undefined;
    WalletConnectRequest: {
        session: SessionTypes.Settled;
        request: WalletConnectRequestEvent;
        signedTx?: SignedCosmosTx;
    };
    SignTx: {
        address: string;
        tx: CosmosTx;
        onSigned: (navigation: any, signedTx: SignedCosmosTx) => void;
    };
    UnlockWallet: {
        address: string
        resolve: (wallet: LocalWallet) => void,
        reject: (error: Error) => void
    }
};

export const AccountScreensStack = createStackNavigator<AccountScreensStackParams>();

export type RootStackParams = {
    AccountCreationScreens: undefined,
    AccountScreens: undefined,
    SelectAccount: undefined,
    Modal: {
        children: ReactNode
    }
}

export const RootStack = createStackNavigator<RootStackParams>()
