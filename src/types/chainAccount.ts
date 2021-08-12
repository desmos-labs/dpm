export enum ChainAccountType {
    Local,
}

export default interface ChainAccount {
    type: ChainAccountType;
    name: string;
    address: string;
    chainId: string;
    dp: string;
};
