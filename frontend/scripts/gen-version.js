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

// Write to .env (overwrites previous NEXT_PUBLIC_VERSION)
let env = '';
if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf8')
    .split('\n')
    .filter(line => !line.startsWith('NEXT_PUBLIC_VERSION='))
    .join('\n');
}
env += `\nNEXT_PUBLIC_VERSION=${dateStr}-${count}\n`;
fs.writeFileSync(envFile, env);

console.log(`Set NEXT_PUBLIC_VERSION=${dateStr}-${count}`); 