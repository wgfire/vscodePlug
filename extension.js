// The module 'vscode' contains the VS Code extensibility API
//  registerCommand   registerTextEditorCommand 的区别  后者必须要打开一个文件后 执行才会有回调
const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "template-code" is now active!');

  let disposable = vscode.commands.registerCommand(
    "template-code.helloWorld",
    function (uri) {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from template-code!",
        "路径：",
        uri.path
      );
    }
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "template-code.testEditorCommand",
      (textEditor, edit) => {
        console.log("您正在执行编辑器命令！");
        console.log(textEditor, edit);
      }
    )
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log("插件被卸载");
}

module.exports = {
  activate,
  deactivate,
};
