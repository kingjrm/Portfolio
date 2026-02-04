const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const fs = require('fs');
const path = require('path');

const inputFile = './src/styles/tailwind.css';
const outputFile = './assets/css/main.css';

const input = fs.readFileSync(inputFile, 'utf8');

postcss([tailwindcss('./tailwind.config.js')])
  .process(input, { from: inputFile, to: outputFile })
  .then(result => {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, result.css);
    console.log('Tailwind CSS built successfully!');
  })
  .catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
  });
