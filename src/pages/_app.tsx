import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

import { useApollo } from '../libs/apollo';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
