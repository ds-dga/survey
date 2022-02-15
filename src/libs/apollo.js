// lib/apollo.js
import { useMemo } from "react"
import { getSession } from "next-auth/react"
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  split,
} from "@apollo/client"
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities"
import { WebSocketLink } from "@apollo/client/link/ws"

let apolloClient
const EvHeader = {
  "x-everyday-app": "satang",
  "x-everyday-client": "next",
  "x-everyday-social-app": null,
  "x-everyday-uid": null,
}

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URI })

// async function getEverydayHook() {
//   return {}
//   const session = await getSession()
//   // console.log("useApollo: ", session)
//   let headers = {
//     "x-everyday-app": "satang",
//     "x-everyday-client": "next",
//   }
//   if (session) {
//     headers = {
//       ...headers,
//       "x-everyday-social-app": session.social.provider || null,
//       "x-everyday-uid": session.social.id || null,
//     }
//   }
//   return headers
// }
// Make sure the wsLink is only created on the browser. The server doesn't have a native implemention for websockets
const wsLink = process.browser
  ? new WebSocketLink({
      uri: process.env.NEXT_PUBLIC_WEBSOCKET_URI,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: async () => {
          const session = await getSession()
          if (!session) return { headers: EvHeader }
          return {
            headers: {
              ...EvHeader,
              "x-everyday-social-app": session.social.provider || null,
              "x-everyday-uid": session.social.id || null,
            },
          }
        },
      },
    })
  : () => {
      console.log("SSR")
    }

const authMiddleware = new ApolloLink(async (operation, forward) => {
  const session = await getSession()
  let headers = { ...EvHeader }
  if (session)
    headers = {
      ...EvHeader,
      "x-everyday-social-app": session.social.provider || null,
      "x-everyday-uid": session.social.id || null,
    }
  // add the authorization to the headers
  operation.setContext({
    headers,
  })
  return forward(operation)
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  concat(authMiddleware, httpLink)
)

// TODO: FIXME: pagination cache doesn't work with search
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        satang_tx: offsetLimitPagination(["txt", "accounts"]),
        satang_account: offsetLimitPagination(),
      },
    },
  },
})

function createApolloClient() {
  return new ApolloClient({
    // ssrMode: typeof window === "undefined", // set to true for SSR
    link: splitLink,
    // link: new HttpLink({ uri: process.env.GRAPHQL_URI }),
    cache,
  })
}

export function initializeApollo(initialState = null) {
  const thisApolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = thisApolloClient.extract()

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    thisApolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return thisApolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = thisApolloClient
  return thisApolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}

export const initOffsetVars = {
  limit: 10,
  offset: 0,
}
