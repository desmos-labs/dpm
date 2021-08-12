import {useState} from "react";
import Deferred from "../types/defered";

export default function <T>():
    [Deferred<T> | null, (promise: Promise<T>) => void] {
    const [deferred, setDeferred] = useState<Deferred<T> | null>(null);

    const run = async (promise: Promise<T>) => {
        setDeferred(Deferred.pending());

        try {
            const value = await promise;
            setDeferred(Deferred.completed(value));
        } catch (e) {
            setDeferred(Deferred.failed(e.toString()));
        }
    }

    return [deferred, run];
}