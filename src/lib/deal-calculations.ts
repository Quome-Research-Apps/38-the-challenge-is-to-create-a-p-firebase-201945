import type { DealInput, DealOutput, YearlyProjection } from '@/types';

export function calculateDealMetrics(inputs: DealInput): DealOutput {
  // Income
  const annualGrossRent = inputs.grossMonthlyRent * 12;
  const annualOtherIncome = inputs.otherMonthlyIncome * 12;
  const totalPotentialIncome = annualGrossRent + annualOtherIncome;
  const vacancyLoss = totalPotentialIncome * (inputs.vacancyPercentage / 100);
  const effectiveGrossIncome = totalPotentialIncome - vacancyLoss;

  // Expenses
  const managementFee = effectiveGrossIncome * (inputs.propertyManagementPercentage / 100);
  const maintenance = effectiveGrossIncome * (inputs.maintenancePercentage / 100);
  const capex = effectiveGrossIncome * (inputs.capexPercentage / 100);
  const annualOperatingExpenses =
    inputs.propertyTaxes + inputs.insurance + managementFee + maintenance + inputs.otherExpenses;
  
  // NOI
  const noi = effectiveGrossIncome - annualOperatingExpenses;

  // Purchase & Loan
  const downPayment = inputs.purchasePrice * (inputs.downPaymentPercentage / 100);
  const loanAmount = inputs.purchasePrice - downPayment;
  const closingCosts = inputs.purchasePrice * (inputs.closingCostsPercentage / 100);
  const totalCashNeeded = downPayment + closingCosts;

  // Debt Service
  const monthlyInterestRate = inputs.interestRate / 100 / 12;
  const numberOfPayments = inputs.loanTerm * 12;
  const monthlyMortgage =
    loanAmount > 0 && monthlyInterestRate > 0
      ? loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : loanAmount / (numberOfPayments || 1);
  const annualDebtService = monthlyMortgage * 12;
  
  // Year 1 KPIs
  const cashFlow = noi - annualDebtService - capex;
  const capRate = (noi / inputs.purchasePrice) * 100;
  const cashOnCashReturn = (cashFlow / totalCashNeeded) * 100;

  // Projections
  const yearlyProjections: YearlyProjection[] = [];
  let cumulativeCashFlow = 0;
  let currentNOI = noi;
  let cashFlow_y = cashFlow;

  for (let year = 1; year <= inputs.holdingPeriod; year++) {
    if (year > 1) {
      const rentGrowthFactor = 1 + inputs.rentGrowthPercentage / 100;
      const expenseGrowthFactor = 1 + inputs.expenseGrowthPercentage / 100;
      
      const prevEGI = effectiveGrossIncome * Math.pow(rentGrowthFactor, year - 1);
      const prevOpEx = annualOperatingExpenses * Math.pow(expenseGrowthFactor, year - 1);
      const prevCapex = capex * Math.pow(rentGrowthFactor, year - 1);
      
      currentNOI = prevEGI * rentGrowthFactor - prevOpEx * expenseGrowthFactor;
      cashFlow_y = currentNOI - annualDebtService - (prevCapex * rentGrowthFactor);
    }
    cumulativeCashFlow += cashFlow_y;
    yearlyProjections.push({ year, noi: currentNOI, cashFlow: cashFlow_y, cumulativeCashFlow });
  }

  const futureSalePrice = inputs.purchasePrice * Math.pow(1 + inputs.appreciationPercentage / 100, inputs.holdingPeriod);
  const remainingLoanBalance = calculateRemainingLoanBalance(loanAmount, inputs.interestRate, inputs.loanTerm, inputs.holdingPeriod);
  const saleProceeds = futureSalePrice - remainingLoanBalance;
  const totalProfit = cumulativeCashFlow + (saleProceeds - (inputs.purchasePrice - remainingLoanBalance));
  const totalEquity = totalCashNeeded + (loanAmount - remainingLoanBalance);
  const totalReturnOnEquity = (totalProfit / totalEquity) * 100;


  return {
    noi,
    capRate,
    cashFlow,
    cashOnCashReturn,
    loanAmount,
    downPayment,
    totalCashNeeded,
    monthlyMortgage,
    annualGrossRent,
    effectiveGrossIncome,
    annualOperatingExpenses,
    yearlyProjections,
    totalProfit,
    totalReturnOnEquity,
  };
}

function calculateRemainingLoanBalance(principal: number, annualRate: number, termYears: number, yearsElapsed: number) {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  const paymentsMade = yearsElapsed * 12;
  if(monthlyRate === 0) return principal - (principal/totalPayments) * paymentsMade;
  const balance = principal * (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, paymentsMade)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  return balance > 0 ? balance : 0;
}
