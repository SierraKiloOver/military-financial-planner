// Mortgage Calculator with VA loan logic
function calculateMortgage({
  homePrice,
  downPayment,
  interestRate,
  loanTermYears,
  isVA,
  isExemptFromFundingFee
}) {
  const fs = require('fs');
  const path = require('path');
  const fundingFeeData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'fundingFeeTable.json'), 'utf-8')
  );

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // P&I monthly payment
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  // VA Funding Fee Logic (using table)
  let fundingFee = 0;
  if (isVA && !isExemptFromFundingFee) {
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const feeBracket = fundingFeeData.find(
      b => downPaymentPercent >= b.minDown && downPaymentPercent <= b.maxDown
    );
    if (feeBracket) {
      // Assume first use for now; can be extended for subsequent use
      fundingFee = feeBracket.firstUse * loanAmount;
    } else {
      // Fallback if no bracket matches
      fundingFee = 0.015 * loanAmount;
    }
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