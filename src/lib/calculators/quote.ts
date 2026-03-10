import { PLAN_PRICES, FULL_TIME_SALARY_PER_PERSON } from './constants';

  export function calculateQuote(seats: number, mdmMonthlyCost: number) {
      const numSeats = seats > 0 ? seats : 0;
      
      const itStaffCount = numSeats > 0 ? Math.ceil(numSeats / 20) : 1;
      const totalFullTimeSalary = itStaffCount * FULL_TIME_SALARY_PER_PERSON;
  
      const calculate = (price: number) => {
        const planMonthlyCost = numSeats * price;
        const monthlyCost = planMonthlyCost + mdmMonthlyCost;
        const yearlyCost = monthlyCost * 12;
        const savings = totalFullTimeSalary - yearlyCost;
        return { monthlyCost, yearlyCost, savings };
      };
  
      return {
        seedcare: calculate(PLAN_PRICES.seedcare),
        seedcarePlus: calculate(PLAN_PRICES.seedcarePlus),
        seedcarePro: calculate(PLAN_PRICES.seedcarePro),
      };
  }

  export function calculateMixedQuote(
    seats: { seedcare: number; seedcarePlus: number; seedcarePro: number },
    mdmMonthlyCost: number
  ) {
    const totalSeats = seats.seedcare + seats.seedcarePlus + seats.seedcarePro;
    const numSeats = totalSeats > 0 ? totalSeats : 0;

    const itStaffCount = numSeats > 0 ? Math.ceil(numSeats / 20) : 1;
    const totalFullTimeSalary = itStaffCount * FULL_TIME_SALARY_PER_PERSON;

    const planMonthlyCost = 
        (seats.seedcare * PLAN_PRICES.seedcare) +
        (seats.seedcarePlus * PLAN_PRICES.seedcarePlus) +
        (seats.seedcarePro * PLAN_PRICES.seedcarePro);

    const monthlyCost = planMonthlyCost + mdmMonthlyCost;
    const yearlyCost = monthlyCost * 12;
    const savings = totalFullTimeSalary - yearlyCost;

    return { monthlyCost, yearlyCost, savings };
  }
  