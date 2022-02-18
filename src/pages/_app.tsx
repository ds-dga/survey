import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import { useApollo } from '../libs/apollo';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  );
};

export default MyApp;
