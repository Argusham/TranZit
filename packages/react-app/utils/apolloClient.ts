import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apolloClient = new ApolloClient({
       link: new HttpLink({
    uri: 'https://api.studio.thegraph.com/query/89300/tranzact/version/latest'
   }),
    cache: new InMemoryCache(),
  });
  
  export default apolloClient;
  