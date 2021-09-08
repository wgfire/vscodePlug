const vscode = require("vscode");
const { window, workspace } = vscode;
const fs = require("fs");
const path = require("path");
const strUtils = require("../../utils/string");
const regular = require("../../utils/Regular");
const { registrationCommand } = require("../../utils/common");
const { createRegisterData, nodeWithIdTreeDataProvider } = require("./componentProvider");
const { unlink } = require("../../utils/fs");
const RootPath =  path.resolve(workspace.workspaceFolders[0].uri.fsPath, ".vscode");  //path.resolve(__dirname, "componentProvider", "template");
const templateFolderPath = path.resolve(__dirname, "../../template", "template-folder.js"); // 默认的模板路径 存在插件 写入客户端
/**
 */
async function rootResolvePath(fileName = "template-folder.js") {
  /**返回.vscode里对应的文件路径
   * 1.判断vscode是否有这文件夹，里面是否有文件
   * */
  let templatePathUri = vscode.Uri.file(RootPath + "/" + fileName); // 写入的文件路径
  let enable = fs.existsSync(RootPath);
  const document = await vscode.workspace.openTextDocument(templateFolderPath);
  // 没有的话创建模板文件夹
  console.log(enable, "创建了.vscode嘛");
  if (!enable) {
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(`${RootPath}`));
    // 创建模板文件
    vscode.workspace.fs.writeFile(templatePathUri, strUtils.stringToUint8Array(document.getText()));
  } else {
    // 是否有模板文件
    let isTemplate = fs.existsSync(path.resolve(RootPath, "template-folder.js"));
    console.log("有内置模板文件嘛", isTemplate);
    if (!isTemplate) {
      vscode.workspace.fs.writeFile(templatePathUri, strUtils.stringToUint8Array(document.getText()));
    }
  }
  return enable;
}

async function createTemplateFile(uri) {
  let isFileOrFolder = regular.isFileOrFolder(uri); // 判断是否文件夹
  if (isFileOrFolder) return window.showErrorMessage("请右键点击文件夹进行操作");
  const InputName = await window.showInputBox({
    placeHolder: `会根据${"组件模板"}来生成文件`,
    prompt: "输入组件的名字 以空格结束 后面跟选择模板的文件名",
  });
  const [FolderName, FolderTemplate] = InputName.split(" "); // 分割组件名 和 组件模板
  console.log(FolderName, FolderTemplate);
  if (!InputName || !FolderTemplate) return window.showErrorMessage("输入的参数有误，请按格式输入");

  let FolderTemplatePath = path.resolve(RootPath, FolderTemplate);
  let result = regular.isFileOrFolder(FolderTemplate); // 是否输入了后缀名
  if (!result) FolderTemplatePath += ".js";
  console.log(FolderTemplatePath, "取模板文件地址");
  const ExiststemplateFolder = fs.existsSync(FolderTemplatePath);
  if (!ExiststemplateFolder) return window.showErrorMessage("找不到模板文件");

  const templateFolder = require(FolderTemplatePath); // 导入用户的模板文件
  let FoldObj = Object.entries(templateFolder(FolderName)); // 获取生成模板对应的对象
  let FolderPath = vscode.Uri.file(`${uri.path}/${FolderName}`); // 创建文件夹路径

  vscode.workspace.fs.createDirectory(FolderPath).then((res) => {
    // 创建文件
    for (let [name, text] of FoldObj) {
      let fileUrl = vscode.Uri.joinPath(FolderPath, name);
      let content = strUtils.stringToUint8Array(text);
      vscode.workspace.fs.writeFile(fileUrl, content);
    }
  });
}
function pageTemplateAdd(init) {

}
function clickTemplateHandel(params) {}

async function pageTemplateDelete(initTree) {
  let templatePath =RootPath
  let deletes = vscode.commands.registerCommand("FolderView.item.delete", async (arg) => {
    let filePath = path.resolve(templatePath, arg.command.arguments[0].fileName);
    try {
      unlink(filePath);
      vscode.window.showErrorMessage("删除模板成功");
      initTree && initTree();
    } catch (error) {
      vscode.window.showErrorMessage("删除模板失败");
    }
  });
}

class FolderView {
  constructor(context) {
    this.context = context;
    this.view = null;
    this.initTree();
    pageTemplateAdd(this.initTree);
    pageTemplateDelete(this.initTree);
    vscode.commands.registerCommand("pageTemplate.refresh", (arg) => {
      console.log("刷新了");
      this.initTree();
    });
  }
  initTree() {
    const registerData = createRegisterData(clickTemplateHandel);
    registrationCommand(registerData);
    vscode.window.createTreeView("templateFolder", { treeDataProvider: nodeWithIdTreeDataProvider(), showCollapseAll: true });
  }
}

module.exports = {
  FolderView,
  rootResolvePath,
  createTemplateFile,
};
