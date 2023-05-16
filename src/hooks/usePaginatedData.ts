import React, { useRef } from 'react';
import _ from 'lodash';

/**
 * Type that represents the data fetched from @see {@link FetchDataFunction} function.
 */
export type PaginatedResult<T> = {
  /**
   * List of fetched items.
   */
  data: T[];
  /**
   * Optional boolean that tells that there aren't any other elements to fetch.
   * If this is undefined will consider the end reached if the length of data
   * is less than the configured items per page.
   */
  endReached?: boolean;
};

/**
 * Type that represents a function capable of fetching data in a paginated
 * manner.
 */
export type FetchDataFunction<T, F> = (
  offset: number,
  limit: number,
  filter?: F,
) => PaginatedResult<T> | Promise<PaginatedResult<T>>;

export interface PaginatedDataConfig {
  /**
   * Number of items that should be fetched per page.
   */
  itemsPerPage: number;
  /**
   * Debounce time applied to the update filter function.
   * If undefined will be used 300ms.
   */
  updateFilterDebounceTimeMs?: number;
}

/**
 * Hook that allows to fetch data in a paginated manner using an optional
 * filter.
 * @param fetchFunction - Function to fetch the data.
 * @param config - Data pagination config.
 * @param initialFilter - Filter that will be applied at the beginning.
 */
export function usePaginatedData<T, F>(
  fetchFunction: FetchDataFunction<T, F>,
  config: PaginatedDataConfig,
  initialFilter?: F,
) {
  const firstExecution = useRef(true);
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [data, setData] = React.useState<T[]>([]);
  const [filter, setFilter] = React.useState<F | undefined>(initialFilter);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<Error>();

  const fetchMore = React.useCallback(
    async (overrideOffset?: number, resetState?: boolean) => {
      setLoading(true);
      // Temp var where we keep the fetched items until we have them all.
      const fetchedItems: T[] = [];
      // Current offset.
      let fetchOffset = overrideOffset ?? currentOffset;
      let stopFetch = false;

      // Loop to fetch exactly itemsPerPage elements even if the fetchFunction
      // returns less than itemsPerPage items because have filtered the
      // items inside the requested page.
      while (fetchedItems.length < config.itemsPerPage && !stopFetch) {
        // Compute how many items we need to fetch
        const fetchLimit = config.itemsPerPage - fetchedItems.length;
        let endReached: boolean | undefined;
        let fetchedData: T[];
        try {
          // eslint-disable-next-line no-await-in-loop
          const fetchResult = await fetchFunction(fetchOffset, fetchLimit, filter);
          fetchedData = fetchResult.data;
          endReached = fetchResult.endReached;
        } catch (e) {
          setError(e);
          fetchedData = [];
          endReached = true;
        }
        // Store the fetched items.
        fetchedItems.push(...fetchedData);
        fetchOffset += fetchLimit;
        stopFetch = endReached ?? fetchedData.length < fetchLimit;
      }

      // Update the current offset.
      setCurrentOffset(fetchOffset);

      // Update the stored items.
      setData((currentData) => (resetState ? fetchedItems : [...currentData, ...fetchedItems]));

      setLoading(false);
    },
    [currentOffset, fetchFunction, filter, config.itemsPerPage],
  );

  const refresh = React.useCallback(async () => {
    setError(undefined);
    setRefreshing(true);
    await fetchMore(0, true);
    setRefreshing(false);
  }, [fetchMore]);

  // Debounced version of setFilter.
  const debouncedSetFilter = React.useMemo(
    () => _.debounce(setFilter, config?.updateFilterDebounceTimeMs ?? 300),
    [config?.updateFilterDebounceTimeMs],
  );

  // Function to update the filter.
  const updateFilter = React.useCallback(
    (newFilter?: F | React.SetStateAction<F | undefined>, noDebounce?: boolean) => {
      if (!noDebounce) {
        debouncedSetFilter(newFilter);
      } else {
        debouncedSetFilter.cancel();
        setFilter(newFilter);
      }
    },
    [debouncedSetFilter],
  );

  // Hook to clear the debounced function when the component is destroyed.
  React.useEffect(
    () => () => {
      debouncedSetFilter.cancel();
    },
    [debouncedSetFilter],
  );

  React.useEffect(() => {
    if (!firstExecution.current) {
      refresh();
    } else {
      firstExecution.current = false;
    }

    // Safe to ignore we want to call the refresh function
    // only if the filter changes or if the provided fetch function
    // has changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, fetchFunction]);

  return {
    data,
    fetchMore,
    refresh,
    loading,
    refreshing,
    updateFilter,
    error,
  };
}
