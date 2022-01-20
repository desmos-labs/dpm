import {
    AddressAndPublicKeyResponse,
    AppInfoResponse,
    LedgerApp,
    ErrorResponse,
    PublicKeyResponse,
    SignResponse,
    VersionResponse
} from "@cosmjs/ledger-amino";
import BluetoothTransport from "@ledgerhq/react-native-hw-transport-ble";
import TerraApp from "@terra-money/ledger-terra-js";

export class TerraLedgerApp implements LedgerApp {

    private readonly app: TerraApp
    private initialized: boolean;

    constructor(transport: BluetoothTransport) {
        this.app = new TerraApp(transport);
        this.initialized = false;
    }

    async appInfo(): Promise<AppInfoResponse | ErrorResponse> {
        if (!this.initialized) {
            await this.app.initialize();
            this.initialized = true;
        }
        const appInfo = this.app.getInfo();
        return {
            ...appInfo,
            appName: appInfo.app_name,
        }
    }

    async getVersion(): Promise<VersionResponse | ErrorResponse> {
        if (!this.initialized) {
            await this.app.initialize();
            this.initialized = true;
        }
        return this.app.getVersion();
    }

    async publicKey(path: Array<number>): Promise<PublicKeyResponse | ErrorResponse> {
        const response = await this.app.getPublicKey(path);
        return {
            compressed_pk: response.compressed_pk !== undefined ? Buffer.from(response.compressed_pk.data) : undefined,
            error_message: response.error_message,
            return_code: response.return_code,
        }
    }

    async showAddressAndPubKey(path: Array<number>, hrp: string): Promise<AddressAndPublicKeyResponse | ErrorResponse> {
        const response = await this.app.showAddressAndPubKey(path, hrp);
        return {
            address: response.bech32_address,
            compressed_pk: response.compressed_pk !== undefined ? Buffer.from(response.compressed_pk.data) : undefined,
            error_message: response.error_message,
            return_code: response.return_code,
        }
    }

    async sign(path: Array<number>, message: string): Promise<SignResponse | ErrorResponse> {
        const response = await this.app.sign(path, message);

        return {
            return_code: response.return_code,
            error_message: response.error_message,
            signature: response.signature !== undefined ? Buffer.from(response.signature.data) : undefined,
        }
    }

}