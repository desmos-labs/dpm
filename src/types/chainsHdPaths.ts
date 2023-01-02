import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';

export const DESMOS_COIN_TYPE = 852;
export const COSMOS_COIN_TYPE = 118;
export const LUNA_COIN_TYPE = 330;
export const KAVA_COIN_TYPE = 459;
export const BAND_COIN_TYPE = 494;
export const CRO_COIN_TYPE = 394;

export const DesmosHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(DESMOS_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];

export const CosmosHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(COSMOS_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];

export const LunaHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(LUNA_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];

export const KavaHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(KAVA_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];

export const BandHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(BAND_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];

export const CroHdPath: HdPath = [
  Slip10RawIndex.hardened(44),
  Slip10RawIndex.hardened(CRO_COIN_TYPE),
  Slip10RawIndex.hardened(0),
  Slip10RawIndex.normal(0),
  Slip10RawIndex.normal(0),
];
