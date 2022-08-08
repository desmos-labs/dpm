import {ChainInfo, convertCoin} from "@desmoslabs/desmjs";
import {Coin} from "@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin";

export function coinsToString(amount: Coin[] | undefined, chainInfo: ChainInfo) {
  if (!amount) {
    return '';
  }
  return amount
      .map((coinAmount) => {
        const converted = convertCoin(coinAmount, 6, chainInfo.denomUnits);
        if (converted !== null) {
          return `${converted.amount} ${converted.denom.toUpperCase()}`;
        }
        return `${coinAmount.amount} ${coinAmount.denom}`;
      })
      .join('\n')
}

export default coinsToString;