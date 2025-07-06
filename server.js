const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const fundingFeeData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'mortgage', 'fundingFeeTable.json'), 'utf-8')
);

function calculateMortgage({
  homePrice,
  downPayment,
  interestRate,
  loanTermYears,
  isVA,
  isExemptFromFundingFee,
  isFirstUse
}) {
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  let fundingFee = 0;
  let fundingFeeRate = 0;
  let fundingFeeBracket = null;
  let fundingFeeExplanation = '';
  if (isVA && !isExemptFromFundingFee) {
    const downPaymentPercent = (downPayment / homePrice) * 100;
    fundingFeeBracket = fundingFeeData.find(
      b => downPaymentPercent >= b.minDown && downPaymentPercent <= b.maxDown
    );
    if (fundingFeeBracket) {
      fundingFeeRate = isFirstUse ? fundingFeeBracket.firstUse : fundingFeeBracket.subsequentUse;
      fundingFee = fundingFeeRate * loanAmount;
      fundingFeeExplanation = `Down payment: ${downPaymentPercent.toFixed(2)}%. ` +
        `Rate used: ${(fundingFeeRate * 100).toFixed(2)}% (${isFirstUse ? 'First Use' : 'Subsequent Use'}).`;
    } else {
      fundingFeeRate = 0.015;
      fundingFee = 0.015 * loanAmount;
      fundingFeeExplanation = 'Default rate 1.5% used (no matching bracket).';
    }
  } else if (isVA && isExemptFromFundingFee) {
    fundingFeeExplanation = 'Borrower is exempt from the VA funding fee.';
  } else {
    fundingFeeExplanation = 'Not a VA loan; no funding fee applied.';
  }

  const totalLoanAmount = loanAmount + fundingFee;
  const totalCost = monthlyPayment * numberOfPayments;

  return {
    loanAmount,
    fundingFee,
    fundingFeeRate,
    fundingFeeBracket,
    fundingFeeExplanation,
    totalLoanAmount,
    monthlyPayment: +monthlyPayment.toFixed(2),
    totalCost: +totalCost.toFixed(2)
  };
}

app.post('/api/calculate', (req, res) => {
  try {
    const result = calculateMortgage(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`VA Loan Calculator API running at http://localhost:${PORT}`);
}); 