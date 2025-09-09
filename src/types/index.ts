import { z } from 'zod';

export const dealInputSchema = z.object({
  // Purchase
  purchasePrice: z.number().positive(),
  closingCostsPercentage: z.number().min(0).max(100),

  // Loan
  downPaymentPercentage: z.number().min(0).max(100),
  interestRate: z.number().min(0).max(100),
  loanTerm: z.number().positive().int(),

  // Income
  grossMonthlyRent: z.number().positive(),
  otherMonthlyIncome: z.number().min(0),

  // Expenses
  propertyTaxes: z.number().min(0),
  insurance: z.number().min(0),
  propertyManagementPercentage: z.number().min(0).max(100),
  maintenancePercentage: z.number().min(0).max(100),
  capexPercentage: z.number().min(0).max(100),
  otherExpenses: z.number().min(0),

  // Assumptions
  vacancyPercentage: z.number().min(0).max(100),
  rentGrowthPercentage: z.number().min(-100).max(100),
  expenseGrowthPercentage: z.number().min(-100).max(100),
  appreciationPercentage: z.number().min(-100).max(100),
  holdingPeriod: z.number().positive().int().max(50),
});

export type DealInput = z.infer<typeof dealInputSchema>;

export const defaultDealInput: DealInput = {
  purchasePrice: 500000,
  closingCostsPercentage: 3,
  downPaymentPercentage: 20,
  interestRate: 6.5,
  loanTerm: 30,
  grossMonthlyRent: 4000,
  otherMonthlyIncome: 0,
  propertyTaxes: 6000,
  insurance: 1500,
  propertyManagementPercentage: 8,
  maintenancePercentage: 5,
  capexPercentage: 5,
  otherExpenses: 1200,
  vacancyPercentage: 5,
  rentGrowthPercentage: 3,
  expenseGrowthPercentage: 2,
  appreciationPercentage: 4,
  holdingPeriod: 10,
};

export interface YearlyProjection {
  year: number;
  noi: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

export interface DealOutput {
  // Key Metrics
  noi: number;
  capRate: number;
  cashFlow: number;
  cashOnCashReturn: number;
  
  // Purchase & Loan
  loanAmount: number;
  downPayment: number;
  totalCashNeeded: number;
  monthlyMortgage: number;
  
  // Income
  annualGrossRent: number;
  effectiveGrossIncome: number;
  
  // Expenses
  annualOperatingExpenses: number;

  // Projections
  yearlyProjections: YearlyProjection[];
  totalProfit: number;
  totalReturnOnEquity: number;
}
