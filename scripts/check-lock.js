const fs = require('fs');
const path = require('path');
const root = process.cwd();
console.log('cwd:', root);
const pkgPath = path.join(root, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('package.json not found');
  process.exit(2);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
console.log('package.json dependencies:', Object.keys(pkg.dependencies || {}).length, 'devDependencies:', Object.keys(pkg.devDependencies || {}).length);

const lockPath = path.join(root, 'package-lock.json');
if (!fs.existsSync(lockPath)) {
  console.log('package-lock.json: not present');
  process.exit(0);
}
let lock;
try {
  lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse package-lock.json:', e.message);
  process.exit(3);
}
console.log('package-lock lockfileVersion:', lock.lockfileVersion || 'unknown');

const packages = lock.packages || {};
let malformed = [];
for (const [pkgPathKey, entry] of Object.entries(packages)) {
  if (!entry || typeof entry !== 'object') continue;
  if ('resolved' in entry && typeof entry.resolved !== 'string') {
    malformed.push({path: pkgPathKey, key: 'resolved', type: typeof entry.resolved});
  }
  if ('version' in entry && typeof entry.version !== 'string') {
    malformed.push({path: pkgPathKey, key: 'version', type: typeof entry.version});
  }
  if ('type' in entry && typeof entry.type !== 'string') {
    malformed.push({path: pkgPathKey, key: 'type', type: typeof entry.type});
  }
  // detect non-string dependencies
  if (entry && entry.dependencies) {
    for (const [d, v] of Object.entries(entry.dependencies)) {
      if (typeof v !== 'string') {
        malformed.push({path: pkgPathKey + '/dependencies/' + d, key: 'dependency-spec', type: typeof v});
      }
    }
  }
}
console.log('malformed entries count:', malformed.length);
if (malformed.length) console.log('sample malformed entries:', JSON.stringify(malformed.slice(0, 20), null, 2));
else console.log('no obvious malformed entries found in package-lock.json');
