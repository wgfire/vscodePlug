const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const { nodeWithIdTreeDataProvider, createRegisterData } = require("./componentProvider");
const { getFile, writeFile, unlink } = require("../../utils/fs");
const { registrationCommand, getRangText } = require("../../utils/common");
const templatePath = path.resolve(__dirname, "componentProvider/template");

const suffix = ".txt";

async function pageTemplateAdd(initTree) {
  const add = vscode.commands.registerTextEditorCommand("pageTemplate.add", async (arg) => {
    let content = getRangText(arg); //getFile(arg.fsPath);
    let fileName = await vscode.window.showInputBox({
      placeHolder: "请输入组件名称，保持名称不重复",
    });
    if (!fileName || !content) return false;
    fileName += suffix;
    let filePath = path.resolve(templatePath, fileName);
    let isTemplate = fs.existsSync(filePath);
    if (!isTemplate) {
      writeFile(filePath, content);
      vscode.window.showInformationMessage("添加成功");
      initTree && initTree();
    } else {
      vscode.window.showErrorMessage("添加失败，已经存在相同名称");
    }
  });
}
async function pageTemplateDelete(initTree) {
  let deletes = vscode.commands.registerCommand("pageTemplate.item.delete", async (arg) => {
    console.log(arg, "模板删除");
    let filePath = path.resolve(templatePath, arg.command.arguments[0].fileName);
    try {
      unlink(filePath);
      vscode.window.showErrorMessage("删除模板成功");
      initTree && initTree();
    } catch (error) {
      console.log(error, "删除失败");
      vscode.window.showErrorMessage("删除模板失败");
    }
  });
}
async function clickTemplateHandel(params) {
  console.log("点击了列表组件", params);
  /**
   * 获取模板然后写入到当前的文件地址
   */
  try {
    // params.fileName += ".txt";
    let writePath = vscode.window.activeTextEditor.document.fileName;
    let getFilePath = path.resolve(templatePath, params.fileName);
    console.log("获取模板的路径", getFilePath);
    writeFile(writePath, getFile(getFilePath));
  } catch (error) {
    vscode.window.showErrorMessage("写入失败，请检查模板文件是否存在");
  }
}

class TestView {
  constructor(context) {
    this.context = context;
    this.view = null;
    this.initTree();
    pageTemplateAdd(this.initTree);
    pageTemplateDelete(this.initTree);
    console.log("初始化树模板");
    vscode.commands.registerCommand("pageTemplate.refresh", (arg) => {
      console.log("刷新了");
      this.initTree();
    });
  }
  initTree() {
    const registerData = createRegisterData(clickTemplateHandel);
    registrationCommand(registerData);
    vscode.window.createTreeView("pageTemplate", { treeDataProvider: nodeWithIdTreeDataProvider(), showCollapseAll: true });
  }
}

module.exports = {
  TestView,
};
