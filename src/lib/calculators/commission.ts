/**
 * Commission calculator for sales view.
 *
 * Re-uses the same PLAN_PRICES from the shared constants so prices stay in sync.
 */
import { PLAN_PRICES, FULL_TIME_SALARY_PER_PERSON } from "./constants";

export const COMMISSION_LADDER = [
  { minSeats: 1, maxSeats: 5, rate: 15 },
  { minSeats: 6, maxSeats: 10, rate: 16 },
  { minSeats: 11, maxSeats: 15, rate: 17 },
  { minSeats: 16, maxSeats: 19, rate: 18 },
  { minSeats: 20, maxSeats: 22, rate: 19 },
  { minSeats: 23, maxSeats: null, rate: 20 },
] as const;

/** Tiered commission rate based on seat count. */
export function getCommissionRate(seats: number): number {
  const normalizedSeats = Math.max(1, Math.floor(seats));

  for (const tier of COMMISSION_LADDER) {
    if (tier.maxSeats === null) {
      if (normalizedSeats >= tier.minSeats) {
        return tier.rate;
      }
      continue;
    }

    if (normalizedSeats >= tier.minSeats && normalizedSeats <= tier.maxSeats) {
      return tier.rate;
    }
  }

  return COMMISSION_LADDER[0].rate;
}

export function calculateCommissions(
  seats: number,
  commissionRate: number,
  mdmMonthlyCost: number
) {
  const numSeats = seats > 0 ? seats : 0;

  const itStaffCount = numSeats > 0 ? Math.ceil(numSeats / 20) : 1;
  const totalFullTimeSalary = itStaffCount * FULL_TIME_SALARY_PER_PERSON;

  const calculate = (price: number) => {
    const planMonthlyCost = numSeats * price;
    const monthlyCost = planMonthlyCost + mdmMonthlyCost;
    const yearlyCost = monthlyCost * 12;
    const savings = totalFullTimeSalary - yearlyCost;
    const monthlyCommission = (monthlyCost * commissionRate) / 100;
    const yearlyCommission = monthlyCommission * 12;
    return { monthlyCost, yearlyCost, savings, monthlyCommission, yearlyCommission };
  };

  return {
    seedcare: calculate(PLAN_PRICES.seedcare),
    seedcarePlus: calculate(PLAN_PRICES.seedcarePlus),
    seedcarePro: calculate(PLAN_PRICES.seedcarePro),
  };
}
