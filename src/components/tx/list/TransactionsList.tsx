import React, {useCallback} from "react";
import {
    SectionList, SectionListRenderItemInfo,
    StyleProp, TouchableOpacity,
    View, ViewStyle
} from "react-native";
import {ChainAccount} from "../../../types/chain";
import {ActivityIndicator} from "react-native-paper";
import Colors from "../../../constants/colors";
import {Divider} from "../../Divider";
import {useFetchTxsGrouppedByDate, SectionedTx} from "../../../graphql/hooks/useFetchTxsGrouppedByDate";
import {formatDistance} from "date-fns";
import {Paragraph} from "../../Paragraph";
import {TransactionListMessageItem} from "./TransactionListMessageItem";
import {makeStyle} from "../../../theming";
import {BroadcastedTx} from "../../../types/tx";

export type Props = {
    chainAccount: ChainAccount,
    onTxPressed: (tx: BroadcastedTx) => void
    style?: StyleProp<ViewStyle>
}

export const TransactionsList: React.FC<Props> = ({chainAccount, style, onTxPressed}) => {
    const {txs, loading, fetchMore} = useFetchTxsGrouppedByDate(chainAccount);
    const styles = useStyles();

    const renderItem = useCallback((info: SectionListRenderItemInfo<BroadcastedTx, SectionedTx>) => {
        const begin = info.index === 0;
        const end = info.index === info.section.data.length - 1;
        const style: StyleProp<ViewStyle> = {
            borderTopLeftRadius: begin ? 8 : 0,
            borderTopRightRadius: begin ? 8 : 0,
            borderBottomLeftRadius: end ? 8 : 0,
            borderBottomRightRadius: end ? 8 : 0,
        }
        const txDate = new Date(info.item.timestamp);
        return <View style={[styles.txMessage, style]}>
            {info.item.msgs.map((encodeObject, index, list) => {
                const showDivider = index < list.length - 1;
                return <TouchableOpacity
                    key={`msg-${info.index}-${index}`}
                    onPress={() => onTxPressed(info.item)}
                >
                    <TransactionListMessageItem
                        encodeObject={encodeObject}
                        date={txDate} />
                    {showDivider ? (<Divider />) : null}
                </TouchableOpacity>
            })}
        </View>
    }, [onTxPressed, styles.txMessage])

    return <SectionList
        style={style}
        sections={txs}
        renderItem={renderItem}
        renderSectionHeader={info => {
            return <Paragraph style={styles.header}>
                {formatDistance(new Date(info.section.date), new Date(), {
                    addSuffix: true
                })}
            </Paragraph>
        }}
        renderSectionFooter={() => <View style={styles.footer}/>}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={true}
        ListFooterComponent={<ActivityIndicator
            animating={loading}
            color={Colors.DesmosOrange}
            hidesWhenStopped={true}
            size="small"
        />}
        ItemSeparatorComponent={Divider}
    />
}

const useStyles = makeStyle(theme => ({
    header: {
        paddingBottom: 8,
        color: "#3d3d3d",
        textTransform: "capitalize"
    },
    footer: {
        paddingBottom: 16,
    },
    txMessage: {
        backgroundColor: theme.colors.background,
        paddingVertical: 8,
        paddingHorizontal: 8,
    }
}))