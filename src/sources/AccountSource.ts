import * as SecureStorage from '../utilils/SecureStorage';
import ChainAccount from '../types/chainAccount';

declare type SourceCache = Map<string, ChainAccount>;

class AccountSource {
    private readonly ACCOUNTS_KEY = 'accounts';
    private _cache: SourceCache | null;

    constructor() {
        this._cache = null;
    }

    async useCache<T>(reader: (cache: SourceCache) => Promise<T>): Promise<T> {
        if (this._cache === null) {
            try {
                const content = await SecureStorage.getItem(this.ACCOUNTS_KEY);
                if (content !== null) {
                    const jsonCache = JSON.parse(content);
                    this._cache = new Map(jsonCache);
                } else {
                    this._cache = new Map();
                }
            } catch (e) {
                this._cache = new Map();
            }
        }

        return reader(this._cache!);
    }

    public async getAllAccounts(): Promise<ChainAccount[]> {
        return this.useCache(async cache => {
            return Array.from(cache.values());
        });
    }

    public async putAccount(account: ChainAccount): Promise<void> {
        const cache = await this.useCache(async cache => {
            cache.set(account.address, account);
            return cache;
        });
        const json = JSON.stringify(Array.from(cache.entries()));
        await SecureStorage.setItem(this.ACCOUNTS_KEY, json);
    }

    public async getAccount(address: string): Promise<ChainAccount> {
        return this.useCache(async cache => {
            const account = cache.get(address);
            if (account === undefined) {
                throw new Error("Can't find account with address: " + address);
            }

            return account;
        });
    }

    public async removeAccount(account: ChainAccount): Promise<void> {
        const cache = await this.useCache(async cache => {
            cache.delete(account.address);
            return cache;
        });

        await SecureStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(cache));
    }
}

const _AccountSource = new AccountSource();

export default _AccountSource;
