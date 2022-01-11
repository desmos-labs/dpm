import {ImageSourcePropType} from "react-native";

export type Subscription = {
    unsubscribe: () => void,
}

export type BleLedger = {
    id: string,
    name: string,
}

export type LedgerApp = {
    /**
     * Ledger application name.
     */
    name: string,
    /**
     * Application icon to be displayed to the user.
     */
    icon: ImageSourcePropType,
    /**
     * Name to be displayed to the user.
     */
    uiName: string,
    /**
     * Min ledger application version.
     */
    minVersion: string,
}


export const LedgerApps: LedgerApp[] = [
    {
        name: "band",
        icon: require("../assets/chains/band.png"),
        uiName: "Band",
        minVersion: "1.5.3",
    },
    {
        name: "Cosmos",
        icon: require("../assets/chains/cosmos.png"),
        uiName: "Cosmos",
        minVersion: "1.5.3",
    },
    {
        name: "Crypto.org Chain",
        icon: require("../assets/chains/crypto_com.png"),
        uiName: "Crypto.org",
        minVersion: "2.16.5",
    },
    {
        name: "kava",
        icon: require("../assets/chains/kava.png"),
        uiName: "Kava",
        minVersion: "1.5.3",
    },
    {
        name: "Terra",
        icon: require("../assets/chains/terra.png"),
        uiName: "Terra",
        minVersion: "1.0.0",
    },
]