const path = require('path');

let calculateMortgage;
try {
  ({ calculateMortgage } = require('./mortgage/calculator'));
} catch (err) {
  console.error('Failed to load calculator module:', err);
  process.exit(1);
}

const input = {
  homePrice: 300000,
  downPayment: 15000,  // 5% down
  interestRate: 6.5,
  loanTermYears: 30,
  isVA: true,
  isExemptFromFundingFee: false,
  isFirstUse: false
};

try {
  const result = calculateMortgage(input);
  console.log('--- VA Loan Calculation Result ---');
  console.log(`Loan Amount: $${result.loanAmount.toLocaleString()}`);
  console.log(`Funding Fee: $${result.fundingFee.toLocaleString()}`);
  console.log(`Total Loan Amount: $${result.totalLoanAmount.toLocaleString()}`);
  console.log(`Monthly Payment: $${result.monthlyPayment.toLocaleString()}`);
  console.log(`Total Cost: $${result.totalCost.toLocaleString()}`);
} catch (err) {
  console.error('Error during calculation:', err);
}