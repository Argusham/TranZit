import { gql } from "@apollo/client";

export const GET_PAYMENT_SENT = gql`
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
    paymentMades(where: { payer: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      id
      payer
      payee
      amount
      blockTimestamp
    }
  }
`
