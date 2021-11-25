import {CosmosHdPath, CroHdPath, HdPath, KavaHdPath, LunaHdPath} from "./hdpath";
import {ImageSourcePropType} from "react-native";
import {ChainConfig} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links";

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
    /**
     * Chain configurations.
     */
    chainConfig: ChainConfig
}

export const LinkableChains: LinkableChain[] = [
    {
        name: "Cosmos Hub",
        prefix: "cosmos",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/cosmos.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "cosmos"
        }),
    },
    {
        name: "Osmosis",
        prefix: "osmo",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/osmosis.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "osmosis"
        }),
    },
    {
        name: "Akash",
        prefix: "akash",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/akash.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "akash"
        }),
    },
    {
        name: "Crypto.org",
        prefix: "cro",
        hdPath: CroHdPath,
        icon: require("../assets/chains/crypto_com.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "crypto.com"
        }),
    },
    {
        name: "Juno",
        prefix: "juno",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/juno.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "juno"
        }),
    },
    {
        name: "Kava",
        prefix: "kava",
        hdPath: KavaHdPath,
        icon: require("../assets/chains/kava.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "kava"
        }),
    },
    {
        name: "Likecoin",
        prefix: "cosmos",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/likecoin.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "likecoin"
        }),
    },
    {
        name: "Terra",
        prefix: "terra",
        hdPath: LunaHdPath,
        icon: require("../assets/chains/terra.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "terra"
        }),
    },
    {
        name: "e-Money",
        prefix: "emoney",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/e_money.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "emoney"
        }),
    },
    {
        name: "Regen",
        prefix: "regen",
        hdPath: CosmosHdPath,
        icon: require("../assets/chains/regen.png"),
        chainConfig: ChainConfig.fromPartial({
            name: "regen"
        }),
    },
]