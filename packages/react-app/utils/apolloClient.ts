import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/89300/taxipaymentmainnet/version/latest',
    cache: new InMemoryCache(),
  });
  
  export default apolloClient;
  