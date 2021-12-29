const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const strUtils = require("./string");
/**
 * 根据key注册vsocde命令
 * @param {*} arg
 * @returns
 */
function registrationCommand(arg) {
  if (!Array.isArray(arg)) throw new Error("请传入数组");
  let register = arg;
  register.forEach((el) => {
    const key = Object.keys(el)[0];
    try {
      vscode.commands.getCommands(false).then((res) => {
        let isregister = res.includes(key);
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
/**
 * 获取项目根目录地址
 */
function getRootPath() {
  try {
    return  vscode.workspace.workspaceFolders[0].uri.fsPath;
  } catch (error) {
    return null;
  }
}
async function rootResolvePath(RootPath,fileName = "folder.js",templateFolderPath) {
  /**返回.vscode里对应的文件路径
   * 1.判断vscode是否有这文件夹，里面是否有文件
   * */
  return new Promise(async(resolve,reject)=>{
    let templatePathUri = vscode.Uri.file(RootPath + "/" + fileName); // 写入的文件路径  
    let enable = fs.existsSync(RootPath);
    const document = await vscode.workspace.openTextDocument(templateFolderPath);
    // 没有的话创建模板文件夹
    console.log(enable, "创建了.vscode嘛");
    if (!enable) {
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(`${RootPath}`));
      // 创建模板文件
      vscode.workspace.fs.writeFile(templatePathUri, strUtils.stringToUint8Array(document.getText()));
      resolve(true)
    } else {
      // 是否有模板文件
      let isTemplate = fs.existsSync(path.resolve(RootPath,fileName));
      console.log("有内置模板文件嘛", isTemplate);
      if (!isTemplate) {
        await vscode.workspace.fs.writeFile(templatePathUri, strUtils.stringToUint8Array(document.getText()));
        vscode.window.showInformationMessage("初始化模板成功");
      }
      resolve(true)
    }
  })

}
module.exports = {
  registrationCommand,
  getRangText,
  getRootPath,
  rootResolvePath,
};
