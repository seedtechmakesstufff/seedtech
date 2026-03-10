/**
 * Commission calculator for sales view.
 *
 * Re-uses the same PLAN_PRICES from the shared constants so prices stay in sync.
 */
import { PLAN_PRICES, FULL_TIME_SALARY_PER_PERSON } from "./constants";

/** Tiered commission rate based on seat count. */
export function getCommissionRate(seats: number): number {
  if (seats >= 200) return 15;
  if (seats >= 100) return 12;
  if (seats >= 50) return 10;
  return 8;
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
