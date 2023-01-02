import React, {useCallback} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {Wallet} from 'types/wallet';
import AddressListItem from 'components/AddressListItem';
import {HdPath} from 'types/cosmos';

const useRenderListItem = (selectedWallet: Wallet | null, onPress: (hdPath: HdPath, address: string, info: ListRenderItemInfo<Wallet>) => void) => {
 return useCallback(
    (info: ListRenderItemInfo<Wallet>) => {
      const { hdPath, address } = info.item;
      return (
        <AddressListItem
          number={hdPath.account}
      address={address}
      highlight={selectedWallet?.address === address}
      onPress={() => onPress(hdPath, address, info)}
      />
    );
    },
    [selectedWallet],
  );
};

export default useRenderListItem;
