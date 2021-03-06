import { ChainAccount } from '../types/chain';
import * as SecureStorage from '../utilils/SecureStorage';

declare type SourceCache = Map<string, ChainAccount>;

/**
 * Data source class to access the user's accounts stored into the device storage.
 */
class AccountSource {
  private readonly ACCOUNTS_KEY = 'accounts';

  private readonly SELECTED_ACCOUNT_KEY = 'selected_account';

  private _cache: SourceCache | null;

  constructor() {
    this._cache = null;
  }

  /**
   * Utility function to interact with the cached values.
   * @param reader - function that will have access and can interact with the cache.
   */
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

  /**
   * Gets all the user's accounts.
   */
  public async getAllAccounts(): Promise<ChainAccount[]> {
    return this.useCache(async (cache) => Array.from(cache.values()));
  }

  public async setSelectedAccount(address: string | null): Promise<void> {
    if (address === null) {
      await SecureStorage.deleteItem(this.SELECTED_ACCOUNT_KEY);
    } else {
      await SecureStorage.setItem(this.SELECTED_ACCOUNT_KEY, address);
    }
  }

  public async getSelectedAccount(): Promise<string | null> {
    return SecureStorage.getItem(this.SELECTED_ACCOUNT_KEY);
  }

  /**
   * Inserts an account into the device storage, if exist an account with the same bech32 address
   * the previous account will be overwritten.
   * @param account - Account that will be inserted.
   */
  public async putAccount(account: ChainAccount): Promise<void> {
    const cache = await this.useCache(async (sourceCache) => {
      sourceCache.set(account.address, account);
      return sourceCache;
    });
    const json = JSON.stringify(Array.from(cache.entries()));
    await SecureStorage.setItem(this.ACCOUNTS_KEY, json);
  }

  /**
   * Gets an account by it's bech32 address.
   * @param address - The bech32 address of the account of interest.
   */
  public async getAccount(address: string): Promise<ChainAccount | null> {
    return this.useCache(async (cache) => {
      const account = cache.get(address);
      return account !== undefined ? account : null;
    });
  }

  /**
   * Checks if exists an account with the provided address.
   * @param address - Address of the account of interest.
   */
  public async exist(address: string): Promise<boolean> {
    return this.useCache(async (cache) => {
      const account = cache.get(address);
      return account !== undefined;
    });
  }

  /**
   * Removes an account from the device storage.
   * @param account - The account that will be removed.
   */
  public async removeAccount(account: ChainAccount): Promise<void> {
    const cache = await this.useCache(async (sourceCache) => {
      sourceCache.delete(account.address);
      return sourceCache;
    });
    await SecureStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(Array.from(cache.entries())));
  }

  /**
   * Removes every account from the device storage.
   */
  public async reset(): Promise<void> {
    await SecureStorage.deleteItem(this.ACCOUNTS_KEY);
    await SecureStorage.deleteItem(this.SELECTED_ACCOUNT_KEY);
    this._cache = new Map<string, ChainAccount>();
  }
}

// Singleton instance that will be exposed.
// eslint-disable-next-line @typescript-eslint/naming-convention
const _AccountSource = new AccountSource();
export default _AccountSource;
