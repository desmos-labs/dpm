export enum ChainAccountType {
    Local,
}

export interface ChainAccount {
    type: ChainAccountType;
    name: string;
    address: string;
}
