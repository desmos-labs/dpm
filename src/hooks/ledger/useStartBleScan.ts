import {useCallback, useEffect, useState} from "react";
import {BleLedger, Subscription} from "../../types/ledger";
import TransportBLE from "@ledgerhq/react-native-hw-transport-ble";

export default function useStartBleScan() {

    const [subscription, setScanSubscription] = useState<Subscription | undefined>(undefined);
    const [stopScanTimeout, setStopStopScanTimeout] = useState<NodeJS.Timer | undefined>(undefined);
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState<BleLedger []>([]);
    const [scanError, setScanError] = useState<string | undefined>(undefined);

    // Clear the subscription when leaving the screen or when staring a new scan.
    useEffect(() => {
        return () => {
            if (subscription !== undefined) {
                subscription.unsubscribe();
            }
        }
    }, [subscription]);

    // Clear the scan timeout
    useEffect(() => {
        return () => {
            if (stopScanTimeout !== undefined) {
                clearTimeout(stopScanTimeout);
            }
        }
    }, [stopScanTimeout]);

    const stopScan = useCallback(() => {
        setScanning(false);
        setScanSubscription(undefined);
    }, [])

    const scan = useCallback((durationMs: number = 10000) => {
        setScanning(true);
        setDevices([]);
        setScanError(undefined);
        setScanSubscription(TransportBLE.listen({
            complete: () => {
                setScanning(false);
            },
            next: (e: any) => {
                if (e.type === "add") {
                    const {id, name} = e.descriptor;

                    setDevices(currentDevices => {
                        const devicePresent = currentDevices.find(d => d.id === id) !== undefined;
                        if (!devicePresent) {
                            return [...currentDevices, {
                                id,
                                name
                            }]
                        } else {
                            return currentDevices;
                        }
                    })
                }
            },
            error: (error: any) => {
                console.error("BLE scan error", error);
                setScanError(error.toString());
            }
        }));
        setStopStopScanTimeout(setTimeout(() => {
            stopScan();
        }, durationMs));
    }, [stopScan]);


    return {
        scan,
        scanning,
        devices,
        scanError
    }

}