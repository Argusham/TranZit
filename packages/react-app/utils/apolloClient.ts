import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/89300/taxipayment/version/latest',
    cache: new InMemoryCache(),
  });
  
  export default client;
  