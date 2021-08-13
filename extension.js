// The module 'vscode' contains the VS Code extensibility API
//  registerCommand   registerTextEditorCommand 的区别  后者必须要打开一个文件后 执行才会有回调
const vscode = require("vscode");
const shareCode = require('./module/shareCode')
const {rootResolvePath,createTemplateFile } = require('./module/createTemplate/index')
const review  = require('./module/review/index')
/**
 */
// async function rootResolvePath(fileName = "template-folder.js") {
//   /**返回.vscode里对应的文件路径
//    * 1.判断vscode是否有这文件夹，里面是否有文件
//    * */
//   let templatePathUri = vscode.Uri.file(RootPath + "/" + fileName); // 写入的文件路径
//   let enable = fs.existsSync(RootPath);
//   // 没有的话创建模板文件夹
//   console.log(enable, "创建了.vscode嘛");
//   if (!enable) {
//     await vscode.workspace.fs.createDirectory(vscode.Uri.file(`${RootPath}`));
//     // 创建模板文件
//   } else {
//     // 是否有模板文件
//     let isTemplate = fs.existsSync(path.resolve(RootPath, "template-folder.js"));
//     console.log('有内置模板文件嘛',isTemplate);
//     if (!isTemplate) {
//       const document = await vscode.workspace.openTextDocument(templateFolderPath);
//       vscode.workspace.fs.writeFile(templatePathUri, strUtils.stringToUint8Array(document.getText()));
//     }
//   }
//   return enable;
// }

// /**
//  * @param {vscode.Uri} uri
//  */

// async function createTemplateFile(uri) {
//   let isFileOrFolder = regular.isFileOrFolder(uri); // 判断是否文件夹
//   if (isFileOrFolder) return window.showErrorMessage("请右键点击文件夹进行操作");
//   const InputName = await window.showInputBox({
//     placeHolder: `会根据${"组件模板"}来生成文件`,
//     prompt: "输入组件的名字 以空格结束 后面跟选择模板的文件名",
//   });
//   const [FolderName, FolderTemplate] = InputName.split(" "); // 分割组件名 和 组件模板
//   console.log(FolderName, FolderTemplate);
//   if (!InputName || !FolderTemplate) return window.showErrorMessage("输入的参数有误，请按格式输入");
//   let FolderTemplatePath = path.resolve(RootPath, FolderTemplate);
//   let result = regular.isFileOrFolder(FolderTemplate); // 是否输入了后缀名
//   if (!result) FolderTemplatePath += ".js";
//   const ExiststemplateFolder = fs.existsSync(FolderTemplatePath);
//   if (!ExiststemplateFolder) return window.showErrorMessage("找不到模板文件");

//   const templateFolder = require(FolderTemplatePath); // 导入用户的模板文件
//   let FoldObj = Object.entries(templateFolder(FolderName)); // 获取生成模板对应的对象
//   let FolderPath = vscode.Uri.file(`${uri.path}/${FolderName}`); // 创建文件夹路径

//   vscode.workspace.fs.createDirectory(FolderPath).then((res) => {
//     // 创建文件
//     for (let [name, text] of FoldObj) {
//       let fileUrl = vscode.Uri.joinPath(FolderPath, name);
//       let content = strUtils.stringToUint8Array(text);
//       vscode.workspace.fs.writeFile(fileUrl, content);
//     }
//   });
// }

// async function shareCode(textEditor) {
//   const start_row = textEditor.selection.start.line;
//   const start_column = textEditor.selection.start.character;
//   const end_row = textEditor.selection.end.line;
//   const end_column = textEditor.selection.end.character;
//   const textRange = new vscode.Range(new vscode.Position(start_row, start_column), new vscode.Position(end_row, end_column));
//   const textContent = textEditor.document.getText(textRange); // 获取选中的文本内容
//   if (!textContent) return window.showErrorMessage("你在逗我？没有选中内容你分享个锤锤！");
//   console.log(textContent);
//   axios.post({ msgtype: "text", msgContent: { content: `机器人向你分享一段代码🤖：
//   ${textContent} `,mentioned_list: ["王港"], mentioned_mobile_list: ["16607491196"] }});
// }

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log('Congratulations, your extension "template-code" is now active!');
  console.log(shareCode instanceof Function);
  rootResolvePath("template-folder.js"); // 判断是否已经有了模板文件
  review(context)

  let disposableCreateFile = vscode.commands.registerCommand("template-code.createFilePath", async (uri) => {
    createTemplateFile(uri);
  });

  let collectCodeSnippet = vscode.commands.registerTextEditorCommand("template-code.collectCodeSnippet", (textEditor, edit) => {
    shareCode(textEditor);
  });

  context.subscriptions.push(disposableCreateFile);
  context.subscriptions.push(collectCodeSnippet);
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log("插件被卸载");
}

module.exports = {
  activate,
  deactivate,
};
