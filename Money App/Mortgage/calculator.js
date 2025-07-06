console.log('Hello World');
// Mortgage Calculator with VA loan logic
function calculateMortgage({
  homePrice,
  downPayment,
  interestRate,
  loanTermYears,
  isVA,
  isExemptFromFundingFee
}) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // P&I monthly payment
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  // VA Funding Fee Logic (simplified)
  let fundingFee = 0;
  if (isVA && !isExemptFromFundingFee) {
    fundingFee = 0.015 * loanAmount; // 1.5% as example; actual varies by usage/down/payment
  }

  const totalLoanAmount = loanAmount + fundingFee;
  const totalCost = monthlyPayment * numberOfPayments;

  return {
    loanAmount,
    fundingFee,
    totalLoanAmount,
    monthlyPayment: +monthlyPayment.toFixed(2),
    totalCost: +totalCost.toFixed(2)
  };
}

// Test run
if (require.main === module) {
  const testInput = {
    homePrice: 400000,
    downPayment: 20000,
    interestRate: 4.5,
    loanTermYears: 30,
    isVA: true,
    isExemptFromFundingFee: false
  };
  const result = calculateMortgage(testInput);
  console.log('--- Mortgage Calculation Result ---');
  console.log(result);
}

module.exports = { calculateMortgage }; 