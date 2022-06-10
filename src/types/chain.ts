import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v2/models_chain_links';
import { ImageSourcePropType } from 'react-native';
import { BandHdPath, CosmosHdPath, CroHdPath, HdPath, KavaHdPath, LunaHdPath } from './hdpath';

export enum ChainAccountType {
  Local,
  Ledger,
}

export type ChainId = 'mainnet' | 'testnet';

export interface ChainAccount {
  /**
   * Account type.
   * Can be a local account or an
   * account imported from an external device like Ledger.
   */
  type: ChainAccountType;
  /**
   * The bech32 address of this account.
   */
  address: string;
  /**
   * The derivation path used to generate this account.
   */
  hdPath: HdPath;
  /**
   * Base64 encoded public key.
   */
  pubKey: string;
  /**
   * Algorithm used to sign a transaction.
   */
  signAlgorithm: 'secp256k1' | 'ed25519' | 'sr25519';
}

/**
 * Type that represents a chain that can be
 * linked to a desmos profile.
 */
export type LinkableChain = {
  /**
   * Chain name.
   */
  name: string;
  /**
   * The chain bech32 prefix.
   */
  prefix: string;
  /**
   * HD path used to derive the keys.
   */
  hdPath: HdPath;
  /**
   * Chain icon.
   */
  icon: ImageSourcePropType;
  /**
   * Chain configurations.
   */
  chainConfig: ChainConfig;
};

export const LinkableChains: LinkableChain[] = [
  {
    name: 'Akash',
    prefix: 'akash',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/akash.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
  },
  {
    name: 'Band',
    prefix: 'band',
    hdPath: BandHdPath,
    icon: require('../assets/chains/band.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/cosmos.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
  },
  {
    name: 'Crypto.org',
    prefix: 'cro',
    hdPath: CroHdPath,
    icon: require('../assets/chains/crypto_com.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'crypto.org',
    }),
  },
  {
    name: 'e-Money',
    prefix: 'emoney',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/e_money.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
  },
  {
    name: 'Juno',
    prefix: 'juno',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/juno.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
  },
  {
    name: 'Kava',
    prefix: 'kava',
    hdPath: KavaHdPath,
    icon: require('../assets/chains/kava.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/likecoin.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/osmosis.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
  },
  {
    name: 'Regen',
    prefix: 'regen',
    hdPath: CosmosHdPath,
    icon: require('../assets/chains/regen.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
  },
  {
    name: 'Terra',
    prefix: 'terra',
    hdPath: LunaHdPath,
    icon: require('../assets/chains/terra.png'),
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
  },
];
