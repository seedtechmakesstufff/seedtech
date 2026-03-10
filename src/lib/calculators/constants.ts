/**
 * Shared pricing constants used by both the quote and commission calculators.
 * 
 * Single source of truth — update prices here and both calculators stay in sync.
 */

export const PLAN_PRICES = {
  seedcare: 110,
  seedcarePlus: 130,
  seedcarePro: 160,
} as const;

export const MDM_PRICE_PER_DEVICE = 12;

export const FULL_TIME_SALARY_PER_PERSON = 65_000;

export type PlanKey = keyof typeof PLAN_PRICES;
