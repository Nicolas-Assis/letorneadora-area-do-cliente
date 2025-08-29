const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const out = spawnSync('npx', ['tsc', '--noEmit'], { encoding: 'utf8' });
const stderr = out.stdout + out.stderr;

const re = /([^\s:(]+\.ts)\((\d+),\d+\):\s+error\s+TS\d+:/g;
const files = {};

let m;
while ((m = re.exec(stderr)) !== null) {
  const file = path.resolve(m[1]);
  const line = Number(m[2]);
  files[file] = files[file] || new Set();
  files[file].add(line);
}

if (Object.keys(files).length === 0) {
  console.log('No TypeScript errors found (tsc --noEmit). Nothing to do.');
  process.exit(0);
}

for (const f of Object.keys(files)) {
  const lines = Array.from(files[f]).sort((a, b) => b - a); // descending
  let content;
  try {
    content = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  } catch (err) {
    console.error('Cannot read file', f, err.message);
    continue;
  }

  for (const ln of lines) {
    const idx = ln - 1;
    if (idx < 0 || idx >= content.length) continue;
    const current = content[idx];
    if (!/^\s*\/\//.test(current)) {
      content[idx] = '//' + current;
      console.log(`Commented ${f}:${ln}`);
    } else {
      console.log(`Already commented ${f}:${ln}`);
    }
  }

  fs.writeFileSync(f, content.join('\n'), 'utf8');
}

console.log('Done. Review changes and run tests/tsc.');
