const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../.version-count');
const envFile = path.join(__dirname, '../.env');

const today = new Date();
const dateStr = today.toISOString().split('T')[0].replace(/-/g, '.'); // e.g. 2024.06.09

let count = 1;
if (fs.existsSync(versionFile)) {
  const [savedDate, savedCount] = fs.readFileSync(versionFile, 'utf8').split(',');
  if (savedDate === dateStr) {
    count = parseInt(savedCount, 10) + 1;
  }
}

// Save the new count for today
fs.writeFileSync(versionFile, `${dateStr},${count}`);

// Write to .env (overwrites previous NEXT_PUBLIC_VERSION) without accumulating blank lines
let existing = '';
if (fs.existsSync(envFile)) {
  existing = fs.readFileSync(envFile, 'utf8');
}

const cleanedLines = existing
  .split('\n')
  .map(line => line.trimEnd())
  .filter(line => line.trim() !== '' && !line.startsWith('NEXT_PUBLIC_VERSION='));

const newEnv = [...cleanedLines, `NEXT_PUBLIC_VERSION=${dateStr}-${count}`].join('\n') + '\n';
fs.writeFileSync(envFile, newEnv);

console.log(`Set NEXT_PUBLIC_VERSION=${dateStr}-${count}`); 