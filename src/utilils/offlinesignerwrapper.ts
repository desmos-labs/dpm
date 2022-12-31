/**
 * Wrapper class to allows on the fly signer update.
 */
import { AccountData, AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import {
  DirectSignResponse,
  isOfflineDirectSigner,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { Signer, SignerStatus, SigningMode } from '@desmoslabs/desmjs';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export default class SignerWrapper extends Signer {
  private readonly signer: OfflineSigner;

  private readonly _signMode: SigningMode | undefined;

  private readonly _throwError = () => {
    throw new Error("Can't sign, the singer is undefined");
  };

  constructor(signer: OfflineSigner) {
    super(SignerStatus.Connected);
    this.signer = signer;
    this._signMode = this.patchMethods(signer);
  }

  /**
   * Function that patches this object so that cosmjs detects the correct signer type.
   * @param signer - The new signer.
   * @private
   */
  private patchMethods(signer: OfflineSigner | undefined): SigningMode | undefined {
    const raw = this as any;
    if (signer === undefined) {
      raw.signAmino = this._throwError;
      raw.signDirect = this._throwError;
      return undefined;
    }

    if (isOfflineDirectSigner(signer)) {
      raw.signAmino = undefined;
      raw.signDirect = (this.signer as OfflineDirectSigner).signDirect.bind(this.signer);
      return SigningMode.DIRECT;
    }

    if ((signer as OfflineAminoSigner).signAmino !== undefined) {
      raw.signAmino = (this.signer as OfflineAminoSigner).signAmino.bind(this.signer);
      raw.signDirect = undefined;
      return SigningMode.AMINO;
    }

    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    throw new Error('Method not patched');
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    throw new Error('Method not patched');
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    if (this.signer === undefined) {
      throw new Error("Can't sign, the singer is undefined");
    }

    return this.signer.getAccounts();
  }

  getCurrentAccount(): Promise<AccountData | undefined> {
    return this.getAccounts().then((accounts) => (accounts.length > 0 ? accounts[0] : undefined));
  }

  get signingMode(): SigningMode {
    return this._signMode!;
  }

  // eslint-disable-next-line class-methods-use-this
  connect(): Promise<void> {
    return Promise.resolve();
  }

  // eslint-disable-next-line class-methods-use-this
  disconnect(): Promise<void> {
    return Promise.resolve();
  }
}
