import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';
import React from 'react';

/**
 * Hook that works like the apollo useQuery hook with the difference that
 * if the component is unmounted, it cancels the query.
 */
export function useAutoCancelQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const abortControllerRef = React.useRef(new AbortController());

  React.useEffect(
    () => () => {
      abortControllerRef.current.abort();
    },
    [],
  );

  return useQuery(query, {
    ...options,
    context: {
      ...options?.context,
      fetchOptions: {
        signal: abortControllerRef.current.signal,
      },
    },
  });
}

export default useAutoCancelQuery;
