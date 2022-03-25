// Airdrop is finished, so we are cleaning up the whole application from the airdrop module
const API_ENDPOINT = __DEV__
  ? 'https://test-api.airdrop.desmos.network'
  : 'https://api.airdrop.desmos.network';

export enum AllocationType {
  Staking,
  LiquidityProvider,
}

type StakingAllocation = {
  type: AllocationType.Staking;
  address: string;
  chainName: string;
  claimed: boolean;
  forboleDelegator: boolean;
  amount: number;
};

type LpAllocation = {
  type: AllocationType.LiquidityProvider;
  address: string;
  chainName: string;
  claimed: boolean;
  amount: number;
};

export type FeeGrantRequestStatus = {
  /**
   * Whether the given user can get a grant or not.
   * This will be false if the user has not been allotted any DSM for the airdrop,
   * or if they already have enough tokens to pay for fees.
   */
  canGetGrant: boolean;
  /**
   * Whether the user cannot get a grant cause their account already has
   * enough tokens inside.
   * This can be true only if can_get_grant is false.
   */
  hasEnoughDsm: boolean;
  /**
   * Whether the given user has already requested a grant or not.
   * If false you can call the POST /airdrop/grants APIs and request
   * for a grant to be issued.
   */
  hasRequestedGrant: boolean;
  /**
   * Whether the user can claim an airdrop by calling the POST /airdrop/claims APIs.
   */
  canClaimAirdrop: boolean;
  /**
   * The Desmos address used to request a grant previously.
   * This will be populated only if has_requested_grant is true
   */
  usedDesmosAddress?: string;
};

export type Allocation = StakingAllocation | LpAllocation;

export const AirdropApi = {
  /**
   * Gets the current airdrop configuration.
   */
  async config(): Promise<{
    airdropEnabled: boolean;
    feeGranter: string;
  }> {
    const configResponse = await fetch(`${API_ENDPOINT}/config`);
    const configJson = await configResponse.json();
    const feeGranter = configJson.granter;
    const airdropEnabled = configJson.airdrop_enabled;
    if (feeGranter === undefined) {
      throw new Error("Can't find fee granter");
    }
    if (airdropEnabled === undefined) {
      throw new Error("Can't find airdrop_enabled field");
    }

    return {
      airdropEnabled,
      feeGranter,
    };
  },

  /**
   * Allows to request a feegrant for the specified user, so that they can create
   * their Desmos Profile and link it to their first chain without having and DSM.
   */
  async requestFeeGrant(externalAddress: string, desmosAddress: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/airdrop/grants`, {
      method: 'POST',
      body: JSON.stringify({
        user_address: externalAddress,
        desmos_address: desmosAddress,
      }),
    });
    if (response.status !== 200) {
      const text = await response.text();
      if (
        text !== 'You already have some DSM in your balance' &&
        text !== 'Grant already requested'
      ) {
        throw {
          name: 'General error',
          message: text,
        } as Error;
      }
    }
  },

  /**
   * Checks if an account is allowed to use the feegrant module.
   */
  async feeGrantStatus(
    desmosAddress: string,
    externalAddress: string
  ): Promise<FeeGrantRequestStatus> {
    const response = await fetch(
      `${API_ENDPOINT}/airdrop/grants/${desmosAddress}/${externalAddress}`
    );
    if (response.status !== 200) {
      throw await response.text();
    } else {
      const json = await response.json();
      const canGetGrant = json.can_get_grant;
      const hasRequestedGrant = json.has_requested_grant;
      const hasEnoughDsm = json.has_enough_dsm;
      const usedDesmosAddress = json.used_desmos_address;
      const canClaimAirdrop = json.can_claim_airdrop;
      return {
        canGetGrant,
        hasRequestedGrant,
        hasEnoughDsm,
        usedDesmosAddress,
        canClaimAirdrop,
      };
    }
  },

  /**
   * Allows to check the amount of DSM that have been allotted to a user, given it's external address.
   * @param externalAddress
   */
  async fetchAllottedDsm(externalAddress: string): Promise<{
    allocations: Allocation[];
    total: number;
  }> {
    const response = await fetch(`${API_ENDPOINT}/users/${externalAddress}`);
    const jsonResponse = await response.json();
    const stakingInfos = jsonResponse.staking_infos;
    const lpInfos = jsonResponse.lp_infos;
    const allotted = jsonResponse.dsm_allotted;
    const parsedAllocations: Allocation[] = [];

    stakingInfos?.forEach((stakingInfo: any) => {
      const { address } = stakingInfo;
      const chainName = stakingInfo.chain_name;
      const claimed = stakingInfo.claimed === true;
      const amount = stakingInfo.dsm_allotted;
      const forboleDelegator = stakingInfo.forbole_delegator === true;
      if (chainName !== undefined && amount !== undefined) {
        parsedAllocations.push({
          type: AllocationType.Staking,
          address,
          chainName,
          claimed,
          amount,
          forboleDelegator,
        });
      }
    });
    lpInfos?.forEach((lpInfo: any) => {
      const { address } = lpInfo;
      const chainName = lpInfo.chain_name;
      const claimed = lpInfo.claimed === true;
      const amount = lpInfo.dsm_allotted;
      if (chainName !== undefined && amount !== undefined) {
        parsedAllocations.push({
          type: AllocationType.LiquidityProvider,
          address,
          chainName,
          claimed,
          amount,
        });
      }
    });

    return {
      allocations: parsedAllocations,
      total: allotted ?? 0,
    };
  },

  /**
   * This allows the user to claim the airdrop. If they already have a Desmos Profile,
   * the chain links will be fetched and the related airdrop amounts will be sent to him.
   * This should be called each time the user connects an external account to
   * their Desmos Profile so that the related DSM amounts can be properly sent to him.
   */
  async claimAirdrop(desmosAddress: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINT}/airdrop/claims`, {
      method: 'POST',
      body: JSON.stringify({
        desmos_address: desmosAddress,
      }),
    });
    if (response.status !== 200) {
      throw await response.text();
    }
  },
};
