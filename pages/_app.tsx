import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      ApplicationDeletePayload: {
        fields: {
          id: {
            read: (_: any, { variables: { id } }: any) => id,
          },
        },
      },
    },
  }),
  link: from([new ApolloLink((operation: any, forward: any) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    }))
    return forward(operation)
  }), new HttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? (window as { PROD_GRAPHQL_URL: string } & Window & typeof globalThis).PROD_GRAPHQL_URL
        : process.env.DEV_GRAPHQL_URL,
  })]),
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
