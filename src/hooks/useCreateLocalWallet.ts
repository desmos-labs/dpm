import {useState} from "react";
import LocalWallet, {LocalWalletOptions} from "../wallet/LocalWallet";
import Deferred from "../types/defered";

export default function():
    [Deferred<LocalWallet> | null, (mnemonic: string, options?: LocalWalletOptions) => void] {
    const [deferredWallet, setDeferredWallet] = useState<Deferred<LocalWallet> | null>(null)

    const create = (userMnemonic: string, options?: LocalWalletOptions) => {
        setDeferredWallet(Deferred.pending());

        const creationTask = () => {
            try {
                const wallet = LocalWallet.fromMnemonic(userMnemonic!, options);
                setDeferredWallet(Deferred.completed(wallet));
                return wallet;
            } catch (ex) {
                setDeferredWallet(Deferred.failed(ex.toString()));
                throw ex;
            }
        }

        if (userMnemonic !== null) {
            // Use a timeout to allow refresh of the ui before doing the crypto operations.
            setTimeout(creationTask, 20);
        }
    }

    return [deferredWallet, create];
}