import { ChainConfig } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { ImageSourcePropType } from 'react-native';
import { HdPath } from '@cosmjs/crypto';
import { ChainInfo } from '@desmoslabs/desmjs';

/**
 * Enum that represents the type of chain that are
 * supported within our application.
 */
export enum ChainType {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

/**
 * Type that represents a chain that is supported within our wallet.
 * It can be either a chain that can be linked or imported as the main wallet.
 */
export type SupportedChain = {
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
  masterHDPath: HdPath;
  /**
   * Chain icon.
   */
  icon: ImageSourcePropType;
  /**
   * Chain configurations.
   */
  chainConfig: ChainConfig;
  /**
   * Optional chain info(s) associated to this chain.
   */
  chainInfo?: ChainInfo[];
};
