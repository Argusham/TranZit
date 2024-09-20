import { gql } from '@apollo/client';

export const GET_PAYMENT_DATA = gql`
  query {
    incentiveAwardeds(first: 5) {
      id
      user
      amount
    }
    paymentMades(first: 10) {
      id
      payer
      payee
      amount
    }
  }
`;
