// The module 'vscode' contains the VS Code extensibility API
//  registerCommand   registerTextEditorCommand 的区别  后者必须要打开一个文件后 执行才会有回调
const vscode = require("vscode");
const shareCode = require("./module/shareCode");
const { rootResolvePath, createTemplateFile, FolderView } = require("./module/createTemplate/index");
const review = require("./module/review/index");
const clearCd = require("./module/clearCD");
const { TestView } = require("./module/TreeData");
const { TreeReview } = require("./module/TreeReview");
const stylesClass = require("./module/classNames");
const clearFileCD = require("./module/clearFileCD");
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log('Congratulations, your extension "template-code" is now active!');
  // rootResolvePath("template-folder.js"); // 判断是否已经有了模板文件
  console.log(vscode.workspace.rootPath, "根目录地址", vscode.workspace.workspaceFolders[0]);

  review(context);

  let disposableCreateFile = vscode.commands.registerCommand("template-code.createFilePath", async (uri) => {
    createTemplateFile(uri);
  });

  let collectCodeSnippet = vscode.commands.registerTextEditorCommand("template-code.collectCodeSnippet", (textEditor, edit) => {
    shareCode(textEditor);
  });
  let disposableClear = vscode.commands.registerTextEditorCommand("template-code.clearCD", (textEditor, edit) => {
    const fileName = textEditor.document.fileName;
    clearCd(fileName);
  });
  let disposableClearFile = vscode.commands.registerCommand("template-code.clearFileCD", (textEditor, edit) => {
    console.log(textEditor, edit, "对象");
    clearFileCD(textEditor._fsPath);
  });
  let classNames = vscode.commands.registerCommand("classNames", (textEditor, edit) => {
    stylesClass(textEditor);
  });

  new TestView(context);
  new TreeReview(context);
  new FolderView(context);
  context.subscriptions.push(disposableCreateFile);
  context.subscriptions.push(collectCodeSnippet);
  context.subscriptions.push(disposableClear);
  context.subscriptions.push(disposableClearFile);
  context.subscriptions.push(classNames);
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log("插件被卸载");
}

module.exports = {
  activate,
  deactivate,
};
