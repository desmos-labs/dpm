import {CosmosHdPath, HdPath, KavaHdPath, LunaHdPath} from "./hdpath";
import {ImageSourcePropType} from "react-native";

export enum ChainAccountType {
    Local,
}

export interface ChainAccount {
    type: ChainAccountType;
    name: string;
    address: string;
}

/**
 * Type that represents a chain that can be
 * linked to a desmos profile.
 */
export type LinkableChain = {
    /**
     * Chain name.
     */
    name: string,
    /**
     * The chain bech32 prefix.
     */
    prefix: string,
    /**
     * HD path used to derive the keys.
     */
    hdPath: HdPath,
    /**
     * Chain icon.
     */
    icon: ImageSourcePropType,
}

export const LinkableChains: LinkableChain[] = [
    {
        name: "Cosmos",
        prefix: "cosmos",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/cosmos.png"),
    },
    {
        name: "Osmosis",
        prefix: "osmosis",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/osmosis.png"),
    },
    {
        name: "Akash",
        prefix: "akash",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/akash.png"),
    },
    {
        name: "Crypto.com",
        prefix: "cro",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/crypto_com.png"),
    },
    {
        name: "Juno",
        prefix: "juno",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/juno.png"),
    },
    {
        name: "Kava",
        prefix: "kava",
        hdPath: KavaHdPath,
        icon: require("../assets/chains/kava.png"),
    },
    {
        name: "Likecoin",
        prefix: "cosmos",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/likecoin.png"),
    },
    {
        name: "Terra",
        prefix: "terra",
        hdPath: LunaHdPath,
        icon: require("../assets/chains/terra.png"),
    },
    {
        name: "e-Money",
        prefix: "emoney",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/e_money.png"),
    },
    {
        name: "Regen",
        prefix: "regen",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/regen.png"),
    },
]