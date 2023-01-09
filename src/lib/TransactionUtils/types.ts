export interface QueriedMessage {
  readonly tx: {
    readonly hash: string;
    readonly success: boolean;
    readonly timestamp: string;
  };

  readonly index: number;
  readonly type: string;
  readonly value: any;
}
