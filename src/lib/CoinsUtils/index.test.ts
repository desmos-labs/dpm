import { coin } from '@cosmjs/amino';
import { sumCoins } from 'lib/CoinsUtils/index';

describe('sumCoins', () => {
  it('sum 2 arrays', () => {
    const a = [coin(20, 'denom1'), coin(3, 'denom2')];
    const b = [coin(22, 'denom1'), coin(3, 'denom0')];

    const sum = sumCoins(a, b);
    expect(sum).toEqual([coin(42, 'denom1'), coin(3, 'denom2'), coin(3, 'denom0')]);
  });

  it('sum 1 array', () => {
    const a = [coin(20, 'denom1'), coin(3, 'denom2'), coin(22, 'denom1')];

    const sum = sumCoins(a);
    expect(sum).toEqual([coin(42, 'denom1'), coin(3, 'denom2')]);
  });
});
