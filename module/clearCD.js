/**
 * 清空console 和 debugger
 */
const { writeFileSync } = require("fs");

const clearCd = (editor) => {
  // 获取用户文本内容
  console.log(editor, "文本内容");
  let Text = editor.document.getText();
  const reg = /(console\.log(.*);?)|(debugger\S*)/g;
  const lines = Text.split("\n");
  const handledLines = [];
  // 逐行删除console和debugger
  for (const line of lines) {
    if (!reg.test(line)) {
      handledLines.push(line);
    }
  }

  let handledContent = handledLines.join("\n");
  console.log(handledContent, "清空的", editor.document.fileName);
  //  vscode.workspace.fs.writeFile(vscode.Uri.file(editor.document.fileName), strUtils.stringToUint8Array(handledContent));
  if (Text != handledContent) writeFileSync(editor.document.fileName, handledContent, { encoding: "utf-8" });
};

module.exports = clearCd;
