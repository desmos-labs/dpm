import {useState} from "react";
import Deferred from "../types/defered";

type RunArgs<T> = Promise<T> | (() => Promise<T>)

/**
 * Hook to run a promise or an async function collecting it's state into a stateful variable.
 * Returns a stateful variable that contains the promise state and a function to run the promise or the async function.
 */
export default function <T>():
    [Deferred<T> | null, (args: RunArgs<T>) => void] {
    const [deferred, setDeferred] = useState<Deferred<T> | null>(null);

    const run = async (args: RunArgs<T>) => {
        setDeferred(Deferred.pending());

        try {
            let value: T;
            if (typeof args === "function") {
                value = await args();
            } else {
                value = await args;
            }
            setDeferred(Deferred.completed(value));
        } catch (e) {
            setDeferred(Deferred.failed(e.toString()));
        }
    }

    return [deferred, run];
}