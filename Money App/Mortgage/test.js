const { calculateMortgage } = require('./calculator');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'examples', 'testInput.json');
const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const result = calculateMortgage(input);
console.log("=== VA Loan Calculation Result ===");
console.log(result);
