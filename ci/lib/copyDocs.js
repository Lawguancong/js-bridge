const fs = require('fs');

function copyDocs(options) {
  const { src, dest, extraParams } = options;

  let newDoc = fs.readFileSync(src, 'utf-8');
  // 更新readme文档版本
  if (extraParams && extraParams.id) {
    let docsTitle = `---\n`;
    Object.keys(extraParams).forEach((key) => {
      docsTitle += `${key}: ${extraParams[key]}\n`;
    });
    docsTitle += `---\n`;

    newDoc = docsTitle + newDoc;
  }
  // console.log(newDoc)
  fs.writeFileSync(dest, newDoc);
}
module.exports = copyDocs;
