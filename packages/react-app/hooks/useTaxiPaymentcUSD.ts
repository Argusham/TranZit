import { useReadContract } from "thirdweb/react";
import { taxiContract } from "../hooks/client";

export function useTaxiPaymentReads(userAddress: string) {
 
  /**
   *  "getUserBalances" read
   *  function getUserBalances(address user)
   *    view returns (uint256 balanceSpent, uint256 balanceReceived)
   */
  const {data: userBalancesData, isPending: isLoadingUserBalances,error: userBalancesError,} = useReadContract({
    contract: taxiContract,
    method:
      "function getUserBalances(address user) view returns (uint256 balanceSpent, uint256 balanceReceived)",
    params: [userAddress],
  });

  // cast for convenience
  const userBalances = userBalancesData as [bigint, bigint] ;

  /**
   * 3) "TAX_PERCENT" read
   *  function TAX_PERCENT() view returns (uint256)
   */
  const {data: taxPercentData, isPending: isLoadingTax, error: taxPercentError,} = useReadContract({
    contract: taxiContract,
    method: "function TAX_PERCENT() view returns (uint256)",
    params: [],
  });

  const taxPercent = taxPercentData as bigint | undefined;

  /**
   * 4) "INCENTIVE_AMOUNT" read
   *  function INCENTIVE_AMOUNT() view returns (uint256)
   */
  const {
    data: incentiveAmountData,
    isPending: isLoadingIncentiveAmount,
    error: incentiveAmountError,
  } = useReadContract({
    contract: taxiContract,
    method: "function INCENTIVE_AMOUNT() view returns (uint256)",
    params: [],
  });

  const incentiveAmount = incentiveAmountData as bigint | undefined;

  /**
   * 5) "INCENTIVE_TRIGGER" read
   *  function INCENTIVE_TRIGGER() view returns (uint256)
   */
  const {
    data: incentiveTriggerData,
    isPending: isLoadingIncentiveTrigger,
    error: incentiveTriggerError,
  } = useReadContract({
    contract: taxiContract,
    method: "function INCENTIVE_TRIGGER() view returns (uint256)",
    params: [],
  });

  const incentiveTrigger = incentiveTriggerData as bigint | undefined;

  /**
   * Return all the relevant values in one object
   */
  return {
    // user balances
    userBalances, // might be undefined until loaded
    isLoadingUserBalances,
    userBalancesError,

    // tax
    taxPercent,
    isLoadingTax,
    taxPercentError,

    // incentive amount
    incentiveAmount,
    isLoadingIncentiveAmount,
    incentiveAmountError,

    // incentive trigger
    incentiveTrigger,
    isLoadingIncentiveTrigger,
    incentiveTriggerError,
  };
}
