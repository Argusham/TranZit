import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  IncentiveAwarded,
  PaymentMade
} from "../generated/TaxiPaymentcUSD/TaxiPaymentcUSD"

export function createIncentiveAwardedEvent(
  user: Address,
  amount: BigInt
): IncentiveAwarded {
  let incentiveAwardedEvent = changetype<IncentiveAwarded>(newMockEvent())

  incentiveAwardedEvent.parameters = new Array()

  incentiveAwardedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  incentiveAwardedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return incentiveAwardedEvent
}

export function createPaymentMadeEvent(
  payer: Address,
  payee: Address,
  amount: BigInt
): PaymentMade {
  let paymentMadeEvent = changetype<PaymentMade>(newMockEvent())

  paymentMadeEvent.parameters = new Array()

  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("payee", ethereum.Value.fromAddress(payee))
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentMadeEvent
}
