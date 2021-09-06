const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
/**
 * 根据key注册vsocde命令
 * @param {*} arg
 * @returns
 */
function registrationCommand(arg) {
  console.log(arg, "arg");
  if (!Array.isArray(arg)) throw new Error("请传入数组");
  let register = arg;
  register.forEach((el) => {
    const key = Object.keys(el)[0];
    try {
      vscode.commands.getCommands(false).then((res) => {
        let isregister = res.includes(key);
        console.log(isregister, "是否注册");
        if (isregister) return true;
        if (isregister === false) {
          let result = vscode.commands.registerCommand(key, el[key]);
          el.result = result;
        }
      });
    } catch (error) {}
  });
  return register;
}

/**
 * 获取当前选中的内容
 */
function getRangText(textEditor) {
  const start_row = textEditor.selection.start.line;
  const start_column = textEditor.selection.start.character;
  const end_row = textEditor.selection.end.line;
  const end_column = textEditor.selection.end.character;
  const textRange = new vscode.Range(new vscode.Position(start_row, start_column), new vscode.Position(end_row, end_column));
  const textContent = textEditor.document.getText(textRange); // 获取选中的文本内容
  return textContent;
}

module.exports = {
  registrationCommand,
  getRangText,
};
