import React, {useEffect, useState, useCallback} from "react";
import {FlatList, FlatListProps} from "react-native";
import {ActivityIndicator, useTheme} from "react-native-paper";

export type Props<ItemT> = Omit<FlatListProps<ItemT>, "data"> & {
    /**
     * Function that loads the items from the provided offset to the limit (excluded).
     * If the function returns null means that there aren't any other elements to load.
     */
    loadPage: (offset: number, limit: number) => Promise<ItemT[] | null>,

    /**
     * Amount of items to load when the list reach the end.
     */
    itemsPerPage: number,
};

export function PaginatedFlatList<ItemT=any>(props: Props<ItemT>): JSX.Element {
    const {loadPage, itemsPerPage} = props;
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [data, setData] = useState<ItemT[]>([]);

    const fetchNextPage = useCallback(async () => {
        setLoading(true);
        const fetched: ItemT[] = [];
        let itemsAvailable = true;
        let offset = currentOffset;
        while (fetched.length < itemsPerPage && itemsAvailable) {
            const itemsToFetch = itemsPerPage - fetched.length
            const data = await loadPage(offset, offset + itemsToFetch);
            if (data !== null) {
                fetched.push(...data);
                offset += itemsToFetch;
            } else {
                itemsAvailable = false;
            }
        }
        if (fetched.length > 0) {
            setData(current => [...current, ...fetched])
        }
        setCurrentOffset(offset);
        setLoading(false);
    }, [currentOffset, loadPage, itemsPerPage]);

    useEffect(() => {
        if (currentOffset === 0) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onEndReached = useCallback((info: { distanceFromEnd: number }) => {
        if (!loading) {
            fetchNextPage();
        }
        if (props.onEndReached) {
            props.onEndReached(info);
        }
    }, [loading, fetchNextPage, props]);

    return <>
        <FlatList
            {...props}
            data={data}
            onEndReached={onEndReached}
            ListFooterComponent={<ActivityIndicator
                animating={loading}
                color={theme.colors.primary}
                hidesWhenStopped={true}
                size="small"
            />}
        />
    </>
}