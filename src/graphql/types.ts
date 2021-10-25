import {gql, QueryHookOptions, useQuery} from "@apollo/client";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
const defaultOptions =  {}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    _coin: any;
    _dec_coin: any;
    _text: any;
    bigint: any;
    coin: any;
    jsonb: any;
    numeric: any;
    smallint: any;
    timestamp: any;
};


export type Block = {
    __typename?: 'block';
    hash: Scalars['String'];
    height: Scalars['bigint'];
    num_txs?: Maybe<Scalars['Int']>;
    proposer_address?: Maybe<Scalars['String']>;
    timestamp: Scalars['String'];
    total_gas?: Maybe<Scalars['bigint']>;
    /** An array relationship */
    transactions: Array<Transaction>;
};


/** columns and relationships of "transaction" */
export type Transaction = {
    __typename?: 'transaction';
    /** An object relationship */
    block: Block;
    fee: Scalars['jsonb'];
    gas_used?: Maybe<Scalars['bigint']>;
    gas_wanted?: Maybe<Scalars['bigint']>;
    hash: Scalars['String'];
    height: Scalars['bigint'];
    logs?: Maybe<Scalars['jsonb']>;
    memo?: Maybe<Scalars['String']>;
    messages: Scalars['jsonb'][];
    raw_log?: Maybe<Scalars['String']>;
    signatures: Scalars['_text'];
    signer_infos: Scalars['jsonb'];
    success: Scalars['Boolean'];
};

export type GetTransactionsByAddressQueryVariables = Exact<{
    address?: Maybe<Scalars['_text']>;
    limit?: Maybe<Scalars['bigint']>;
    offset?: Maybe<Scalars['bigint']>;
    types?: Maybe<Scalars['_text']>;
}>;


export type GqlTransaction = {
    __typename?: 'message'
    transaction: {__typename?: 'transaction' }
        & Pick<Transaction, 'height' | 'hash' | 'success' | 'messages' | 'fee' | 'memo'>
        & {
        block: (
            { __typename?: 'block' }
            & Pick<Block, 'height' | 'timestamp'>
            )
    }
}

export type GetTransactionsByAddressQuery = { transactionsByAddress: Array<(
        { __typename?: 'message' }
        & { transaction: (
            { __typename?: 'transaction' }
            & Pick<Transaction, 'height' | 'hash' | 'success' | 'messages' | 'fee' | 'memo'>
            & { block: (
                { __typename?: 'block' }
                & Pick<Block, 'height' | 'timestamp'>
                ) }
            ) }
        )> };

export const GetTransactionsByAddressDocument = gql`
    query GetTransactionsByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
        transactionsByAddress: messages_by_address(
            args: {addresses: $address, types: $types, limit: $limit, offset: $offset}
        ) {
            transaction {
                height
                hash
                success
                messages
                fee
                memo
                block {
                    height
                    timestamp
                }
            }
        }
    }`;

/**
 * __useGetMessagesByAddressQuery__
 *
 * To run a query within a React component, call `useGetMessagesByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      types: // value for 'types'
 *   },
 * });
 */
export function useGetTransactionsByAddressQuery(baseOptions?: QueryHookOptions<GetTransactionsByAddressQuery, GetTransactionsByAddressQueryVariables>) {
    const options = {...defaultOptions, ...baseOptions}
    return useQuery<GetTransactionsByAddressQuery, GetTransactionsByAddressQueryVariables>(GetTransactionsByAddressDocument, options);
}