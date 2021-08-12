import LocalWallet from "../wallet/LocalWallet";
import useRunPromise from "./useRunPromise";
import LocalWalletsSource from "../sources/LocalWalletsSource";
import Deferred from "../types/defered";

export default function ():
    [Deferred<void> | null, (wallet: LocalWallet, password: string, biometricProtected?: boolean) => void] {

    const [value, run] = useRunPromise<void>()

    const walletSave = async (wallet: LocalWallet, password: string, biometricProtected?: boolean) => {
        run(LocalWalletsSource.putWallet(wallet, password, biometricProtected));
    }

    return [value, walletSave]
}