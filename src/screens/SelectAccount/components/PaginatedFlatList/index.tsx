import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, FlatListProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export type PaginatedFlatListProps<ItemT> = Omit<FlatListProps<ItemT>, 'data'> & {
  /**
   * Function that loads the items from the provided offset to the limit (excluded).
   * If the function returns null means that there aren't any other elements to load.
   */
  loadPage: (offset: number, limit: number) => Promise<ItemT[] | null>;

  /**
   * Amount of items to load when the list reach the end.
   */
  itemsPerPage: number;
};

const PaginatedFlatList = (props: PaginatedFlatListProps<any>) => {
  const { loadPage, itemsPerPage, onEndReached } = props;
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const fetchNextPage = useCallback(async () => {
    setLoading(true);
    const fetched: any[] = [];
    let itemsAvailable = true;
    let offset = currentOffset;
    while (fetched.length < itemsPerPage && itemsAvailable) {
      const itemsToFetch = itemsPerPage - fetched.length;
      // Need to understand how to refactor this part. Actually we can't use Promise.all because it is a while loop.
      // eslint-disable-next-line no-await-in-loop
      const items = await loadPage(offset, offset + itemsToFetch);
      if (items !== null) {
        fetched.push(...items);
        offset += itemsToFetch;
      } else {
        itemsAvailable = false;
      }
    }

    if (fetched.length > 0) {
      setData((current) => [...current, ...fetched]);
    }
    setCurrentOffset(offset);
    setLoading(false);
  }, [currentOffset, loadPage, itemsPerPage]);

  const onPageEndReached = useCallback(
    (info: { distanceFromEnd: number }) => {
      if (!loading) {
        fetchNextPage().then(() => {});
      }
      if (onEndReached) {
        onEndReached(info);
      }
    },
    [loading, onEndReached, fetchNextPage],
  );

  useEffect(() => {
    if (currentOffset === 0) {
      fetchNextPage().then(() => {});
    }

    // Safe to ignore, since we need to fetch the first page when the component
    // is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlatList
      {...props}
      data={data}
      onEndReached={onPageEndReached}
      ListFooterComponent={<ActivityIndicator animating={loading} hidesWhenStopped size="small" />}
    />
  );
};

export default PaginatedFlatList;
