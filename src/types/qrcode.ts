/**
 * Interface that represents a scanned QR Code.
 */
export interface QrCode {
  /**
   * The string value, or undefined if it cannot be decoded.
   */
  readonly data?: string;
}
