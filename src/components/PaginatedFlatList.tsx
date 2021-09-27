import React, {useEffect, useState, useCallback} from "react";
import {FlatList, FlatListProps} from "react-native";
import {ActivityIndicator, useTheme} from "react-native-paper";

export type Props<ItemT> = Omit<FlatListProps<ItemT>, "data"> & {
    /**
     * Function that loads the items at a give page.
     * If the function returns null means that there aren't any other elements to load.
     */
    loadPage: (pageIndex: number) => Promise<ItemT[] | null>,
};

export function PaginatedFlatList<ItemT=any>(props: Props<ItemT>): JSX.Element {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [data, setData] = useState<ItemT[]>([]);

    const fetchNextPage = useCallback(async () => {
        setLoading(true);
        const data = await props.loadPage(currentPage);
        if (data !== null) {
            setData(curr => [...curr, ...data]);
            setCurrentPage(currentPage + 1);
        }
        setLoading(false);
    }, [currentPage, props]);

    useEffect(() => {
        if (currentPage === 0) {
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