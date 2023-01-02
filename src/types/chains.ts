import {ChainConfig, Proof} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { ImageSourcePropType } from 'react-native';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {HdPath} from '@cosmjs/crypto';

export type ChainLink = {
  /**
   * Name of the linked chain like osmosis, cosmos.
   */
  chainName: string;
  /**
   * Desmos address of the user.
   */
  userAddress: string;
  /**
   * User address on the linked chain.
   */
  externalAddress: string;
  /**
   * Time when the chain link has been created.
   */
  creationTime: Date;
};

/**
 * Type that represents the information need to
 * prove the ownership of a different chain account.
 */
export type ChainLinkProof = {
  /**
   * Cryptographic proof.
   */
  proof: Proof;
  /**
   * External chain informations.
   */
  chainConfig: ChainConfig;
  /**
   * External chain address.
   */
  chainAddress: Any;
};

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

