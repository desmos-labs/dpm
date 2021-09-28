import {createStackNavigator} from '@react-navigation/stack';
import ChainAccount from './chainAccount';
import {WalletConnectRequestEvent} from '../store/WalletConnectStore';
import {CosmosTx, SignedCosmosTx} from './tx';
import {SessionTypes} from '@walletconnect/types';
import {DesmosProfile} from "@desmoslabs/sdk-core";
import {ReactNode} from "react";
import LocalWallet from "../wallet/LocalWallet";
import {EncodeObject} from "@cosmjs/proto-signing";
import {createDrawerNavigator} from "@react-navigation/drawer";

export type AccountCreationStackParams = {
    Home: undefined;
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

export type AppDrawerParams = {
    AccountScreen: undefined
}

export const AppDrawer = createDrawerNavigator<AppDrawerParams>()

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
    BroadcastTx: {
        signer: ChainAccount,
        msgs: EncodeObject [],
        onSuccess: () => void,
        onCancel: () => void,
    }
    UnlockWallet: {
        address: string
        resolve: (wallet: LocalWallet) => void,
        reject: (error: Error) => void
    }
};

export const AccountScreensStack = createStackNavigator<AccountScreensStackParams>();

export type RootStackParams = {
    SplashScreen: undefined,
    AccountCreationScreens: undefined,
    AccountScreens: undefined,
    SelectAccount: undefined,
    Modal: {
        children: ReactNode
    }
}

export const RootStack = createStackNavigator<RootStackParams>()
