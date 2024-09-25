import { gql } from "@apollo/client";

export const GET_PAYMENT_DATA = gql`
  query {
      incentiveAwardeds(first: 5) {
      id
      user
      amount
    }
    paymentMades(first: 5, orderBy: blockTimestamp, orderDirection: desc) {
      id
      payer
      payee
      amount
      blockTimestamp
    }
  }
`;

export const GET_USER_INCENTIVES = gql`
  query GetUserIncentives($userAddress: Bytes!) {
    incentiveAwardeds(where: { user: $userAddress }) {
      id
      user
      amount
    }
  }
`;

export const GET_PAYMENTS_RECEIVED = gql`
  query GetPaymentData($address: String!) {
    paymentMades(where: { payee: $address }) {
      id
      payer
      payee
      amount
    }
  }
`
