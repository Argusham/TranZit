import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { IncentiveAwarded } from "../generated/schema"
import { IncentiveAwarded as IncentiveAwardedEvent } from "../generated/TaxiPaymentcUSD/TaxiPaymentcUSD"
import { handleIncentiveAwarded } from "../src/taxi-paymentc-usd"
import { createIncentiveAwardedEvent } from "./taxi-paymentc-usd-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let payer = Address.fromString("0x0000000000000000000000000000000000000001")
    let amount = BigInt.fromI32(234)
    let newIncentiveAwardedEvent = createIncentiveAwardedEvent(payer, amount)
    handleIncentiveAwarded(newIncentiveAwardedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("IncentiveAwarded created and stored", () => {
    assert.entityCount("IncentiveAwarded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "IncentiveAwarded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "payer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "IncentiveAwarded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
