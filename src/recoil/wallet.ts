import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Wallet } from 'types/wallet';

/**
 * Recoil state that holds the wallets that have been unlocked.
 * Each wallet is saved in a Record where the key is the address associated with that wallet.
 * These wallets are stored to prevent the user from having to unlock
 * the wallet multiple times when they are performing multiple operations.
 */
const unlockedWalletsAppState = atom<Record<string, Wallet>>({
  key: 'unlockedWalletsAppState',
  default: {},
  dangerouslyAllowMutability: true,
});

/**
 * Hook that provides a function update the unlocked wallet associated
 * to a user.
 */
export const useSetUnlockedWallet = () => {
  const setUnlockedWallet = useSetRecoilState(unlockedWalletsAppState);

  return React.useCallback(
    (userAddress: string, wallet: Wallet | undefined) => {
      setUnlockedWallet((currentValue) => {
        const newValue = { ...currentValue };
        if (wallet) {
          newValue[userAddress] = wallet;
        } else {
          delete newValue[userAddress];
        }
        return newValue;
      });
    },
    [setUnlockedWallet],
  );
};

/**
 * Hook that provides a function that returns the unlocked wallet associated
 * to a user.
 */
export const useGetUserUnlockedWallet = () => {
  const unlockedWallets = useRecoilValue(unlockedWalletsAppState);

  return React.useCallback(
    (userAddress: string) => unlockedWallets[userAddress],
    [unlockedWallets],
  );
};
