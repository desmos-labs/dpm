import React, {useEffect} from "react";
import {Button, NativeSyntheticEvent, SafeAreaView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import useCreateLocalWallet from "../../hooks/useCreateLocalWallet";
import ChainAccount, {ChainAccountType} from "../../types/chainAccount";
import useSaveWallet from "../../hooks/useSaveWallet";
import useSaveAccount from "../../hooks/useSaveAccount";
import {DeferredState} from "../../types/defered";


declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateAccountKeys">;

export default function GenerateAccountKeys(props: Props): JSX.Element {

    const {mnemonic, account, index, name} = props.route.params;
    const [createWalletStatus, create] = useCreateLocalWallet();
    const [saveWalletStatus, saveWallet] = useSaveWallet();
    const [saveAccountStatus, saveAccount] = useSaveAccount()

    const onContinuePressed = (_: NativeSyntheticEvent<TouchEvent>) => {
        const wallet = createWalletStatus!.value();
        const account: ChainAccount = {
            type: ChainAccountType.Local,
            name: name,
            address: wallet.bech32Address,
        }
        saveWallet(wallet!, props.route.params.password);
        saveAccount(account);
    }

    useEffect(() => {
        return props.navigation.addListener("beforeRemove", e => {
            if (createWalletStatus === null || createWalletStatus.isPending() || createWalletStatus.isCompleted()) {
                e.preventDefault();
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createWalletStatus])

    useEffect(() => {
        if (createWalletStatus === null) {
            create(mnemonic, { account, index });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createWalletStatus])

    useEffect(() => {
        if (saveWalletStatus?.isCompleted() && saveAccountStatus?.isCompleted()) {
            props.navigation.popToTop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveWalletStatus, saveAccountStatus])



    if (createWalletStatus === null || createWalletStatus?.isPending()) {
        return <SafeAreaView>
            <Text>Generating account keys...</Text>
        </SafeAreaView>
    } else {
        switch (createWalletStatus.state()) {
            case DeferredState.Completed:
                const wallet = createWalletStatus.value();
                return <SafeAreaView>
                    <Text>Account created!</Text>
                    <Text>Address: {wallet.bech32Address}</Text>
                    <Button title={"Continue"} onPress={onContinuePressed}/>
                </SafeAreaView>

            case DeferredState.Failed:
                return <SafeAreaView>
                    <Text>Error while creating the account:</Text>
                    <Text>{createWalletStatus.error()}</Text>
                </SafeAreaView>

            default:
                return <SafeAreaView>
                    <Text>App unknown state</Text>
                </SafeAreaView>
        }
    }
}