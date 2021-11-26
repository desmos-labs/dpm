const API_ENDPOINT = __DEV__ ? 'https://test-api.airdrop.desmos.network' : 'https://api.airdrop.desmos.network';


export enum AllocationType {
    Staking,
    LiquidityProvider,
}

type StakingAllocation = {
    type: AllocationType.Staking
    chainName: string,
    claimed: boolean,
    forboleDelegator: boolean,
    amount: number,
}

type LpAllocation = {
    type: AllocationType.LiquidityProvider
    chainName: string,
    claimed: boolean,
    amount: number,
}

export enum FeeGrantStatus {
    NotRequested,
    Allowed,
    Pending,
    Fail,
}

export type FeeGrantRequestStatus = {
    status: FeeGrantStatus,
    message?: string,
}

export type Allocation = StakingAllocation | LpAllocation;

export const AirdropApi = {

    /**
     * Gets the current airdrop configuration.
     */
    config: async function(): Promise<{
        airdropEnabled: boolean,
        feeGranter: string,
    }> {
        const configResponse = await fetch(`${API_ENDPOINT}/config`);
        const configJson = await configResponse.json();
        const feeGranter = configJson["granter"];
        const airdropEnabled = configJson["airdrop_enabled"];
        if (feeGranter === undefined) {
            throw new Error("Can't find fee granter");
        }
        if (airdropEnabled === undefined) {
            throw new Error("Can't find airdrop_enabled field");
        }

        return {
            airdropEnabled,
            feeGranter,
        }
    },

    /**
     * Allows to request a feegrant for the specified user, so that they can create
     * their Desmos Profile and link it to their first chain without having and DSM.
     */
    requestFeeGrant: async function (externalAddress: string, desmosAddress: string): Promise<void> {
        const response = await fetch(`${API_ENDPOINT}/airdrop/grants`, {
            method: "POST",
            body: JSON.stringify({
                user_address: externalAddress,
                desmos_address: desmosAddress
            })
        });
        if (response.status !== 200) {
            const text = await response.text();
            if (text !== "You already have some DSM in your balance"  &&
                text !== "Grant already requested") {
                throw text;
            }
        }
    },

    /**
     * Checks if an account is allowed to use the feegrant module.
     */
    feeGrantStatus: async function(desmosAddress: string, externalAddress: string): Promise<FeeGrantRequestStatus> {
        try {
            const response = await fetch(`${API_ENDPOINT}/airdrop/grants/${desmosAddress}/${externalAddress}`);
            if (response.status !== 200) {
                return {
                    status: FeeGrantStatus.Fail,
                    message: await response.text().catch(ex => ex.toString()),
                }
            } else {
                const json = await response.json();
                const canGetGrant = json["can_get_grant"];
                const grantRequested = json["has_requested_grant"];
                const grantIssued = json["has_grant_been_issued"];

                if (canGetGrant === false) {
                    return {
                        status: FeeGrantStatus.Fail,
                        message: `Can't get fee grant for ${desmosAddress} ${externalAddress}`
                    }
                }
                else if (grantRequested === false) {
                    return {
                        status: FeeGrantStatus.NotRequested,
                    }
                }
                else if (grantIssued === false) {
                    return {
                        status: FeeGrantStatus.Pending,
                    }
                }
                else {
                    return {
                        status: FeeGrantStatus.Allowed,
                    }
                }
            }
        } catch (e) {
            return  {
                status: FeeGrantStatus.Fail,
                message: e.toString()
            }
        }
    },

    /**
     * Allows to check the amount of DSM that have been allotted to a user, given it's external address.
     * @param externalAddress
     */
    fetchAllottedDsm: async function(externalAddress: string): Promise<{
        allocations: Allocation[],
        total: number,
    }> {
        const response = await fetch(`${API_ENDPOINT}/users/${externalAddress}`);
        const jsonResponse = await response.json();
        const stakingInfos = jsonResponse["staking_infos"];
        const lpInfos = jsonResponse["lp_infos"];
        const allotted = jsonResponse["dsm_allotted"];
        const parsedAllocations: Allocation[] = []

        stakingInfos?.forEach((stakingInfo: any) => {
            const chainName = stakingInfo["chain_name"];
            const claimed = stakingInfo["claimed"] === true;
            const amount = stakingInfo["dsm_allotted"];
            const forboleDelegator = stakingInfo["forbole_delegator"] === true;
            if (chainName !== undefined && amount !== undefined) {
                parsedAllocations.push({
                    type: AllocationType.Staking,
                    chainName,
                    claimed,
                    amount,
                    forboleDelegator,
                })
            }
        });
        lpInfos?.forEach((lpInfo: any) => {
            const chainName = lpInfo["chain_name"];
            const claimed = lpInfo["claimed"] === true;
            const amount = lpInfo["dsm_allotted"];
            if (chainName !== undefined && amount !== undefined) {
                parsedAllocations.push({
                    type: AllocationType.LiquidityProvider,
                    chainName,
                    claimed,
                    amount,
                })
            }
        });

        return {
            allocations: parsedAllocations,
            total: allotted ?? 0,
        }
    },

    /**
     * This allows the user to claim the airdrop. If they already have a Desmos Profile,
     * the chain links will be fetched and the related airdrop amounts will be sent to him.
     * This should be called each time the user connects an external account to
     * their Desmos Profile so that the related DSM amounts can be properly sent to him.
     */
    claimAirdrop: async function(desmosAddress: string): Promise<void> {
        const response = await fetch(`${API_ENDPOINT}/airdrop/claims`, {
            method: "POST",
            body: JSON.stringify({
                desmos_address: desmosAddress
            })
        });
        if (response.status !== 200) {
            throw await response.text();
        }
    }
}