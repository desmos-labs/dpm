import React, { useCallback, useState } from 'react';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo as FlashListRenderItemInfo,
} from '@shopify/flash-list';
import { useTheme } from 'react-native-paper';

export type ListRenderItemInfo<T> = FlashListRenderItemInfo<T>;

export type PaginatedFlashListProps<ItemT> = Omit<FlashListProps<ItemT>, 'data'> & {
  /**
   * Function that loads the items from the provided offset to the limit (excluded).
   * If the function returns null means that there aren't any other elements to load.
   */
  loadPage: (offset: number, limit: number) => Promise<ItemT[] | null>;

  /**
   * Amount of items to load when the list reach the end.
   */
  itemsPerPage: number;

  /**
   * Callback called when the loading state changes.
   */
  onLoadStateChange?: (loading: boolean) => any;
};

const PaginatedFlatList = (props: PaginatedFlashListProps<any>) => {
  const { loadPage, itemsPerPage, onEndReached, onLoadStateChange } = props;
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const theme = useTheme();

  const setLoadingState = useCallback(
    (l: boolean) => {
      if (onLoadStateChange) onLoadStateChange(l);
      setLoading(l);
    },
    [onLoadStateChange],
  );

  const fetchNextPage = useCallback(async () => {
    setLoadingState(true);
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
    setLoadingState(false);
  }, [setLoadingState, currentOffset, itemsPerPage, loadPage]);

  const onPageEndReached = useCallback(() => {
    if (!loading) {
      fetchNextPage().then(() => {});
    }
    if (onEndReached) {
      onEndReached();
    }
  }, [loading, onEndReached, fetchNextPage]);

  return (
    <FlashList
      {...props}
      data={data}
      onEndReached={onPageEndReached}
      ListFooterComponent={
        <StyledActivityIndicator
          style={{ paddingBottom: theme.spacing.s }}
          animating={loading}
          hidesWhenStopped
          size="small"
        />
      }
    />
  );
};

export default PaginatedFlatList;
