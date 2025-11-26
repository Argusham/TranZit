import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  IncentiveAwarded,
  PaymentMade
} from "../generated/TaxiPaymentcUSD/TaxiPaymentcUSD"

export function createIncentiveAwardedEvent(
  payer: Address,
  amount: BigInt
): IncentiveAwarded {
  let incentiveAwardedEvent = changetype<IncentiveAwarded>(newMockEvent())

  incentiveAwardedEvent.parameters = new Array()

  incentiveAwardedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  incentiveAwardedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return incentiveAwardedEvent
}

export function createPaymentMadeEvent(
  payer: Address,
  driver: Address,
  amount: BigInt
): PaymentMade {
  let paymentMadeEvent = changetype<PaymentMade>(newMockEvent())

  paymentMadeEvent.parameters = new Array()

  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("driver", ethereum.Value.fromAddress(driver))
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentMadeEvent
}
