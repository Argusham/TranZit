import { gql } from "@apollo/client";

export const GET_PAYMENT_DATA = gql`
  query {
      incentiveAwardeds(where: { user: $userAddress }) {
      amount
    }
    paymentMades(orderBy: blockTimestamp, orderDirection: desc) {
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
