import {
	ChainConfig,
	Proof,
} from '@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links';
import { Any } from '@desmoslabs/proto/google/protobuf/any';

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
