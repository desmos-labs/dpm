import {useCallback, useState} from "react";
import {GqlTransaction, useGetTransactionsByAddressQuery} from "../types";
import {ChainAccount} from "../../types/chain";
import {EncodeObject} from "@cosmjs/proto-signing";
import {
    MsgDelegateEncodeObject,
    MsgSaveProfileEncodeObject,
    MsgSendEncodeObject,
    MsgVoteEncodeObject,
    MsgWithdrawDelegatorRewardEncodeObject
} from "@desmoslabs/sdk-core"
import {Coin, StdFee} from "@cosmjs/amino";
import {BroadcastedTx} from "../../types/tx";
import {MsgTypes} from "../../types/msgtypes";
import {VoteOption} from "cosmjs-types/cosmos/gov/v1beta1/gov";
import Long from "long";

const LIMIT = 20;

export type SectionedTx = {
    date: string,
    data: BroadcastedTx[],
}

/**
 * Converts a graph ql message into a Encode object.
 * @param msg - The message to convert.
 */
function gqlMessageToEncodeObject(msg: any): EncodeObject {
    const type = msg["@type"] ?? "Unknown message type";
    switch (type) {
        case MsgTypes.MsgSend:
            return {
                typeUrl: type,
                value: {
                    amount: msg["amount"],
                    toAddress: msg["to_address"],
                    fromAddress: msg["from_address"],
                }
            } as MsgSendEncodeObject

        case MsgTypes.MsgWithdrawDelegatorReward:
            return {
                typeUrl: type,
                value: {
                    delegatorAddress: msg["delegator_address"],
                    validatorAddress: msg["validator_address"],
                }
            } as MsgWithdrawDelegatorRewardEncodeObject

        case MsgTypes.MsgVote:
            let voteOption: VoteOption;
            switch (msg["option"]) {
                case "VOTE_OPTION_YES":
                    voteOption = VoteOption.VOTE_OPTION_YES;
                    break;

                case "VOTE_OPTION_ABSTAIN":
                    voteOption = VoteOption.VOTE_OPTION_ABSTAIN;
                    break;

                case "VOTE_OPTION_NO":
                    voteOption = VoteOption.VOTE_OPTION_NO;
                    break;

                case "VOTE_OPTION_NO_WITH_VETO":
                    voteOption = VoteOption.VOTE_OPTION_NO_WITH_VETO;
                    break;

                default:
                    voteOption = VoteOption.VOTE_OPTION_UNSPECIFIED;
                    break;
            }
            return {
                typeUrl: type,
                value: {
                    voter: msg["voter"],
                    option: voteOption,
                    proposalId: Long.fromString(msg["proposal_id"]),
                }
            } as MsgVoteEncodeObject

        case MsgTypes.MsgDelegate:
            return {
                typeUrl: type,
                value: {
                    amount: msg["amount"],
                    delegatorAddress: msg["delegator_address"],
                    validatorAddress: msg["validator_address"],
                }
            } as MsgDelegateEncodeObject

        case MsgTypes.MsgSaveProfile:
            return {
                typeUrl: "/desmos.profiles.v1beta1.MsgSaveProfile",
                value: {
                    dtag: msg["dtag"],
                    nickname: msg["nickname"],
                    bio: msg["bio"],
                    coverPicture: msg["cover_picture"],
                    profilePicture: msg["profile_picture"],
                    creator: msg["creator"],
                }
            } as MsgSaveProfileEncodeObject

        default:
            return {
                typeUrl: type,
                value: {
                    ...msg,
                }
            }
    }
}

/**
 * Converts a graphql fee object int StdFee
 * @param gqlFee - The object to convert.
 */
function gqlFeeToStdFee(gqlFee: any): StdFee {
    return {
        gas: gqlFee["gas_limit"] ?? "0",
        amount: gqlFee["amount"]?.map((gqlCoin: any) => {
            return {
                amount: gqlCoin["amount"] ?? "0",
                denom: gqlCoin["denom"] ?? "",
            } as Coin
        }),
    }
}

/**
 * Converts a graphql transaction into a BroadcastedTx.
 * @param tx - The transaction to convert.
 */
function mapTransactions(tx: GqlTransaction): BroadcastedTx {
    return {
        hash: tx.transaction.hash,
        msgs: tx.transaction.messages.map(gqlMessageToEncodeObject),
        fee: gqlFeeToStdFee(tx.transaction.fee),
        memo: tx.transaction.memo ?? "",
        success: tx.transaction.success,
        timestamp: tx.transaction.block.timestamp + "Z",
    }
}

/**
 * Function to group a list of transaction by date.
 * @param groups - Record where will be stored the transaction.
 * @param tx - The transaction to store.
 */
function groupTransactionByDate(groups: Record<string, BroadcastedTx[]>, tx: BroadcastedTx): Record<string, BroadcastedTx[]> {
    const date: string = tx.timestamp.split("T")[0];
    if (groups[date] === undefined) {
        groups[date] = []
    }
    groups[date].push(tx);
    return groups;
}

/**
 * Fetch all the transactions performed by an account and group them by the
 * day in which are been broadcasted.
 * @param chainAccount - The account of interest.
 */
export function useFetchTxsGrouppedByDate(chainAccount: ChainAccount) {
    const [loading, setLoading] = useState(true);
    const [txs, setTxs] = useState<SectionedTx[]>([]);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [dataAvailable, setDataAvailable] = useState(true);

    const transactionQuery = useGetTransactionsByAddressQuery({
        variables: {
            address: `{${chainAccount.address}}`,
            limit: LIMIT + 1,
            offset: 0,
            types: "{}"
        },
        onCompleted: fetchedData => {
            const txs = fetchedData.transactionsByAddress
                .map(mapTransactions)
                .reduce(groupTransactionByDate, {});
            const sorted = Object.entries(txs).sort((obj1, obj2) => {
                return obj1[0].localeCompare(obj2[0]);
            }).map(obj => {
                return {
                    date: obj[0],
                    data: obj[1],
                } as SectionedTx
            }).reverse();
            setTxs(sorted);
            setLoading(false);
            setCurrentOffset(LIMIT + 1);
            setDataAvailable(fetchedData.transactionsByAddress.length > LIMIT)
        }
    });

    const fetchMore = useCallback(async () => {
        if (dataAvailable) {
            setLoading(true);
            try {
                const queryResponse = await transactionQuery.fetchMore({
                    variables: {
                        address: `{${chainAccount.address}}`,
                        limit: LIMIT + 1,
                        offset: currentOffset,
                        types: "{}"
                    },
                });
                const fetchedTransactions = queryResponse.data.transactionsByAddress
                    .map(mapTransactions);
                setTxs(transactions => {
                    const baseObj: Record<string, BroadcastedTx[]> = {}
                    transactions.forEach(tx => {
                        baseObj[tx.date] = tx.data
                    })
                    const txMap = fetchedTransactions
                        .reduce(groupTransactionByDate, baseObj);

                    return Object.entries(txMap)
                        .sort((obj1, obj2) => {
                            return obj1[0].localeCompare(obj2[0])
                        }).map(obj => {
                            return {
                                date: obj[0],
                                data: obj[1],
                            } as SectionedTx
                        }).reverse();
                });
                setCurrentOffset(current => current + LIMIT + 1);
                setDataAvailable(queryResponse.data.transactionsByAddress.length > LIMIT)
            } catch (e) {
                setDataAvailable(false);
            }
            setLoading(false);
        }
    }, [dataAvailable, chainAccount.address, currentOffset, transactionQuery]);

    return {
        txs,
        loading,
        fetchMore,
    }
}