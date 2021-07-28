
type Status = "pending" | "fulfilled" | "rejected";

export default class PromiseState<T> {

    private readonly status: Status
    private readonly _value: T | undefined;
    private readonly _error: string | undefined;

    constructor(status: Status, value: T | undefined, error: string | undefined) {
        this.status = status;
        this._value = value;
        this._error = error;
    }

    isPending(): boolean {
        return this.status === "pending";
    }

    isFulfilled(): boolean {
        return this.status === "fulfilled";
    }

    isRejected(): boolean {
        return this.status === "rejected";
    }

    get value(): T | undefined {
        return this._value;
    }

    get error(): string | undefined {
        return this._error;
    }

    static pending<T>(): PromiseState<T> {
        return new PromiseState<T>("pending", undefined, undefined);
    }
}

declare global {
    interface Promise<T> {
        observeState(callback: (state: PromiseState<T>) => void): Promise<T>;
    }
}

Promise.prototype.observeState = function (callback: (state: PromiseState<any>) => void) {
    return this.then(r => {
        callback(new PromiseState<any>("fulfilled", r, undefined));
        return r;
    }).catch(ex => {
        callback(new PromiseState<any>("rejected", undefined, ex.toString()));
        throw ex;
    });
}