import AccountSource from "../sources/AccountSource";
import {useRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import {useEffect, useState} from "react";
import Deferred from "../types/defered";

export default function (): Deferred<null> {

    const [loadStatus, setLoadStatus] = useState<Deferred<null>>(Deferred.pending());
    const [, setAccounts] = useRecoilState(AccountStore.chainAccounts);

    const loadAccounts = async () => {
        try {
            const accounts = await AccountSource.getAllAccounts();
            setAccounts(accounts);
            setLoadStatus(Deferred.completed(null))
        } catch (ex) {
            setLoadStatus(Deferred.failed(ex.toString()))
        }
    }

    useEffect(() => {
        loadAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loadStatus;
}