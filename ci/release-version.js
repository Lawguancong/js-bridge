// 用于处理 提升版本以及构建的脚本命令
const { resolve } = require('path');
const fs = require('fs');

const releaseConfigJson = resolve(__dirname, '../.releaserc');
const releaseVersionConfigJson = resolve(__dirname, './release-version.config.json');

const buildData = fs.readFileSync(releaseVersionConfigJson);

fs.writeFileSync(releaseConfigJson, buildData);
