// The module 'vscode' contains the VS Code extensibility API
//  registerCommand   registerTextEditorCommand 的区别  后者必须要打开一个文件后 执行才会有回调
const vscode = require("vscode");
const { window, workspace } = vscode;
const fs = require("fs");
const path = require("path");
const strUtils = require("./utils/string");
const regular = require("./utils/Regular");
const RootPath = path.resolve(
  workspace.workspaceFolders[0].uri.fsPath,
  ".vscode"
);

// const templateFolder = require("./template/template-folder");
const templateFolderPath = path.resolve(
  __dirname,
  "template",
  "template-folder.js"
);
const { log } = require("console");

/**
 */
async function rootResolvePath(fileName = "template-folder.js") {
  /**返回.vscode里对应的文件路径
   * 1.判断vscode是否有这文件夹，里面是否有文件
   * */
  let templatePathUri = vscode.Uri.file(RootPath + "/" + fileName); // 写入的文件路径
  let enable = fs.existsSync(RootPath);
  // 没有的话创建模板文件夹
  if (!enable) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(`${RootPath}`));
    // 创建模板文件
    const document = await vscode.workspace.openTextDocument(
      templateFolderPath
    );
    log(strUtils.stringToUint8Array(document.getText()));
    vscode.workspace.fs.writeFile(
      templatePathUri,
      strUtils.stringToUint8Array(document.getText())
    );
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log('Congratulations, your extension "template-code" is now active!');
  let result = rootResolvePath("template-folder.js");

  let disposableCreateFile = vscode.commands.registerCommand(
    "template-code.createFilePath",
    async (uri) => {
      //return false;
      console.log("在菜单里创建文件夹", uri);
      let isFileOrFolder = regular.isFileOrFolder(uri);
      if (isFileOrFolder)
        return window.showErrorMessage("请右键点击文件夹进行操作");
      const InputName = await window.showInputBox({
        placeHolder: `会根据${"组件模板"}来生成文件`,
        prompt: "输入组件的名字 以空格结束 后面跟选择模板的文件名",
      });
      if (!InputName) return false;

      let [FolderName, FolderTemplate] = InputName.split(" ");
      let FolderTemplatePath = path.resolve(RootPath, FolderTemplate);
      const ExiststemplateFolder = fs.existsSync(FolderTemplatePath);
      if (!ExiststemplateFolder)
        return window.showErrorMessage("找不到模板文件");
      const templateFolder = require(FolderTemplatePath);
      let FoldObj = Object.entries(templateFolder(FolderName));
      let FolderPath = vscode.Uri.file(`${uri.path}/${FolderName}`);

      vscode.workspace.fs.createDirectory(FolderPath).then((res) => {
        // 创建文件
        for (let [name, text] of FoldObj) {
          let fileUrl = vscode.Uri.joinPath(FolderPath, name);
          let content = strUtils.stringToUint8Array(text);
          vscode.workspace.fs.writeFile(fileUrl, content);
        }
      });
    }
  );
  context.subscriptions.push(disposableCreateFile);

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "template-code.testEditorCommand",
      async (textEditor, edit) => {
        console.log("您正在执行编辑器命令！");
        const fileName = await window.showInputBox({
          placeHolder: `会根据${"组件模板"}来替换内容`,
          prompt: "输入组件的模板",
        });
        const { workspaceFolders } = workspace;
        console.log(workspaceFolders, "工作区");
        const templatePath = path.resolve(
          __dirname,
          "template",
          "template1.js"
        );
        console.log(templatePath, "模板路径");
        // const document = await vscode.workspace.openTextDocument(templatePath);
        // vscode.workspace.fs
        //   .writeFile(
        //     textEditor.document.uri,
        //     strUtils.stringToUint8Array(document.getText())
        //   )
        //   .then((res) => {
        //     console.log(res, "写入完成");
        //   });

        //  let template = fs.readFileSync(templatePath);

        console.log(textEditor.document.uri, edit);
      }
    )
  );
}

// this method is called when your extension is deactivated
function deactivate() {
  console.log("插件被卸载");
}

module.exports = {
  activate,
  deactivate,
};
