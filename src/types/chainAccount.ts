export enum ChainAccountType {
    Local,
}

export default interface ChainAccount {
    type: ChainAccountType;
    name: string;
    address: string;
};
