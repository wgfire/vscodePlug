const axios = require("../utils/axios");
const vscode = require("vscode");
const { window } = vscode;
async function shareCode(textEditor) {
  const start_row = textEditor.selection.start.line;
  const start_column = textEditor.selection.start.character;
  const end_row = textEditor.selection.end.line;
  const end_column = textEditor.selection.end.character;
  const textRange = new vscode.Range(new vscode.Position(start_row, start_column), new vscode.Position(end_row, end_column));
  const textContent = textEditor.document.getText(textRange); // 获取选中的文本内容
  if (!textContent) return window.showErrorMessage("你在逗我？没有选中内容你分享个锤锤！");
  console.log(textContent);
  axios.post({
    msgtype: "text",
    msgContent: {
      content: `机器人向你分享一段代码🤖：
    ${textContent} `,
      mentioned_list: ["王港"],
      mentioned_mobile_list: ["16607491196"],
    },
  });
}

module.exports = shareCode;
