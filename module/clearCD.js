/**
 * 清空console 和 debugger
 */
const { writeFileSync } = require("fs");
const { window } = require("vscode");
const { getFile } = require("../utils/fs");

const clearCd = (fileName) => {
  const Text = getFile(fileName);
  const reg = /(console\.log(.*)\s?;?)|(debugger.*)/g;
  const lines = Text.split("\n");
  const handledLines = [];
  // 逐行删除console和debugger
  for (const line of lines) {
    if (!reg.test(line)) {
      handledLines.push(line);
    }
  }

  let handledContent = handledLines.join("\n");
  // console.log(handledContent, "清空的", fileName);
  //  vscode.workspace.fs.writeFile(vscode.Uri.file(editor.document.fileName), strUtils.stringToUint8Array(handledContent));
  if (Text != handledContent) writeFileSync(fileName, handledContent, { encoding: "utf-8" });
  window.showInformationMessage('清除成功')
};

module.exports = clearCd;
