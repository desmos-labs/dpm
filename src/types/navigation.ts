import {createStackNavigator} from '@react-navigation/stack';
import ChainAccount from './chainAccount';
import {WalletConnectRequestEvent} from '../store/WalletConnectStore';
import {CosmosTx, SignedCosmosTx} from './tx';
import {SessionTypes} from '@walletconnect/types';
import {HdPath} from "./hdpath";

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

export const AccountCreationStack =
    createStackNavigator<AccountCreationStackParams>();

export type RootStackParams = {
    Accounts: undefined;
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
};

export const RootStack = createStackNavigator<RootStackParams>();
