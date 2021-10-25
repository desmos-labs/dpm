import {useMemo} from "react";
import {ApolloClient, InMemoryCache} from "@apollo/client";

export default function useApolloClient() {
    return useMemo(() => {
        return new ApolloClient({
            uri: 'https://gql.morpheus.desmos.network/v1/graphql',
            cache: new InMemoryCache()
        });
    }, [])
}