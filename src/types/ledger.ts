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
}


export const LedgerApps: LedgerApp[] = [
    {
        name: "cosmos",
        icon: require("../assets/chains/cosmos.png"),
        uiName: "Cosmos",
    },
    {
        name: "band",
        icon: require("../assets/chains/band.png"),
        uiName: "Band",
    },
    {
        name: "terra",
        icon: require("../assets/chains/terra.png"),
        uiName: "Terra",
    },
    {
        name: "kava",
        icon: require("../assets/chains/kava.png"),
        uiName: "Kava",
    },
]