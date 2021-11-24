// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for the list of all slips.
export const DESMOS_COIN_TYPE = 852;
export const COSMOS_COIN_TYPE = 118;
export const LUNA_COIN_TYPE = 330;
export const KAVA_COIN_TYPE = 459;
export const BAND_COIN_TYPE = 494;
export const CRO_COIN_TYPE = 394;

export type HdPath = {
    coinType: number
    account: number,
    change: number,
    addressIndex: number,
}

export const DesmosHdPath: HdPath = {
    coinType: DESMOS_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}

export const CosmosHdPath: HdPath = {
    coinType: COSMOS_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}

export const LunaHdPath: HdPath = {
    coinType: LUNA_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}

export const KavaHdPath: HdPath = {
    coinType: KAVA_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}

export const BandHdPath: HdPath = {
    coinType: BAND_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}

export const CroHdPath: HdPath = {
    coinType: CRO_COIN_TYPE,
    account: 0,
    change: 0,
    addressIndex: 0,
}