import {
  IncentiveAwarded as IncentiveAwardedEvent,
  PaymentMade as PaymentMadeEvent
} from "../generated/TaxiPaymentcUSD/TaxiPaymentcUSD"
import { IncentiveAwarded, PaymentMade } from "../generated/schema"

export function handleIncentiveAwarded(event: IncentiveAwardedEvent): void {
  let entity = new IncentiveAwarded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentMade(event: PaymentMadeEvent): void {
  let entity = new PaymentMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.payer = event.params.payer
  entity.payee = event.params.payee
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
