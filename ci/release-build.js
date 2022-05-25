// 用于处理 提升版本以及构建的脚本命令
const { resolve } = require('path');
const fs = require('fs');

const releaseConfigJson = resolve(__dirname, '../.releaserc');
const releaseBuildConfigJson = resolve(__dirname, 'release-build.config.json');

const buildData = fs.readFileSync(releaseBuildConfigJson);

fs.writeFileSync(releaseConfigJson, buildData);
