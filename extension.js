// The module 'vscode' contains the VS Code extensibility API
//  registerCommand   registerTextEditorCommand 的区别  后者必须要打开一个文件后 执行才会有回调
const vscode = require("vscode");
const shareCode = require("./module/shareCode");
const { rootResolvePath, createTemplateFile } = require("./module/createTemplate/index");
const review = require("./module/review/index");
const clearCd = require("./module/clearCD");
const { TestView } = require("./module/TreeData");
/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log('Congratulations, your extension "template-code" is now active!');
  console.log(shareCode instanceof Function);
  rootResolvePath("template-folder.js"); // 判断是否已经有了模板文件
  review(context);

  let disposableCreateFile = vscode.commands.registerCommand("template-code.createFilePath", async (uri) => {
    createTemplateFile(uri);
  });

  let collectCodeSnippet = vscode.commands.registerTextEditorCommand("template-code.collectCodeSnippet", (textEditor, edit) => {
    shareCode(textEditor);
  });
  let disposableClear = vscode.commands.registerTextEditorCommand("template-code.clearCD", (textEditor, edit) => {
    clearCd(textEditor);
  });

  //const view = vscode.window.createTreeView("testView", { treeDataProvider: aNodeWithIdTreeDataProvider(), showCollapseAll: true });
  // vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  new TestView(context);
  context.subscriptions.push(disposableCreateFile);
  context.subscriptions.push(collectCodeSnippet);
  context.subscriptions.push(disposableClear);
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log("插件被卸载");
}

module.exports = {
  activate,
  deactivate,
};
