import { gql } from "@apollo/client";

export const GET_PAYMENT_MADE = gql`
  query GetPaymentMade($address: Bytes!) {
    paymentMades(where: { payer: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      id
      payer
      driver
      amount
      blockTimestamp
    }
  }
`;

export const GET_PAYMENTS_RECEIVED = gql`
  query GetPaymentData($address: Bytes!) {
    paymentMades(where: { driver: $address }, orderBy: blockTimestamp, orderDirection: desc) {
      id
      payer
      driver
      amount
      blockTimestamp
    }
  }
`

export const GET_USER_INCENTIVES = gql`
  query GetUserIncentives($userAddress: Bytes!) {
    incentiveAwardeds(where: { payer: $userAddress }) {
      id
      payer
      amount
      blockTimestamp
    }
  }
`;