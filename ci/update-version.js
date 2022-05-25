const { resolve } = require('path');
const fs = require('fs');

const extraArgs = process.argv.slice(2);
if (!(Array.isArray(extraArgs) && extraArgs.length)) {
  return;
}
const pkgPath = resolve(__dirname, '../package.json');

const pkgData = fs.readFileSync(pkgPath);

const nextVersionData = JSON.stringify(
  {
    ...JSON.parse(pkgData),
    version: extraArgs[0],
  },
  null,
  2,
);
fs.writeFileSync(pkgPath, nextVersionData);
