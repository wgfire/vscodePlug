const axios = require("../utils/axios");
const vscode = require("vscode");
const { window } = vscode;

async function getUserList() {
  // 根据输入框获取@人员的信息，以逗号分割 不填默认所有人
  const userList = await window.showInputBox({
    placeHolder: `被@的人员，以逗号分割，不填默认所有人`,
  });

  try {
    return userList ? userList.split(",") : ["所有人"];
  } catch (error) {
    return window.showErrorMessage("输入信息有误，请重新输入");
  }
}

async function shareCode(textEditor) {
  const start_row = textEditor.selection.start.line;
  const start_column = textEditor.selection.start.character;
  const end_row = textEditor.selection.end.line;
  const end_column = textEditor.selection.end.character;
  const textRange = new vscode.Range(new vscode.Position(start_row, start_column), new vscode.Position(end_row, end_column));
  const textContent = textEditor.document.getText(textRange); // 获取选中的文本内容
  if (!textContent) return window.showErrorMessage("你在逗我？没有选中内容你分享个锤锤！");
  const userList = await getUserList();
  console.log(userList, "用户啊");
  axios.post({
    msgtype: "text",
    msgContent: {
      content: `机器人向你分享一段代码🤖：
    ${textContent} `,
      mentioned_list: userList || ["王港"],
      mentioned_mobile_list: ["16607491196"],
    },
  });
}

module.exports = shareCode;
