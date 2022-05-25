const { resolve } = require('path');
const fs = require('fs');
const copyDocs = require('./lib/copyDocs');
const pkg = require('../package.json');

const getPathBySource = (...paths) => resolve(__dirname, '../', ...paths);

const readMePath = getPathBySource('./README.md');
const changelogPath = getPathBySource('./CHANGELOG.md');
const docsUsagePath = getPathBySource('./docusaurus/docs/usage.md');
const docsChangeLogPath = getPathBySource('./docusaurus/docs/changelog.md');

const readMeStr = fs.readFileSync(readMePath, 'utf-8');

// 更新readme文档版本
const newReadStr = readMeStr.replace(/webio[-.0-9]{7}js/, `webio-${pkg.version}.js`);
fs.writeFileSync(readMePath, newReadStr);

// 复制readme文档
copyDocs({
  src: readMePath,
  dest: docsUsagePath,
  extraParams: {
    id: 'usage',
    title: '安装',
    sidebar_position: 1,
  },
});
// 复制changelog文档
copyDocs({
  src: changelogPath,
  dest: docsChangeLogPath,
  extraParams: {
    id: 'changelog',
    title: '更新日志',
    sidebar_position: 2,
  },
});
