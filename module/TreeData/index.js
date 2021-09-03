const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const treeDataProviderBuyComponent = require("./componentProvider");
const { getFile, writeFile } = require("../../utils/fs");
const { registrationCommand } = require("../../utils/common");
const templatePath = path.resolve(__dirname, "componentProvider/template");

const suffix = ".txt";

async function pageTemplateAdd(params) {}
async function pageTemplateDelete(params) {}
async function clickTemplateHandel(params) {
  console.log("点击了列表组件", params);
  /**
   * 获取模板然后写入到当前的文件地址
   */
  try {
    params.fileName += ".txt";
    let writePath = vscode.window.visibleTextEditors[0].document.fileName;
    let getFilePath = path.resolve(templatePath, params.fileName);
    console.log("获取写入的路径", getFilePath);
    writeFile(writePath, getFile(getFilePath));
  } catch (error) {
    vscode.window.showErrorMessage("写入失败，请检查模板文件是否存在");
  }
}
const registerData = [
  {
    "pageTemplate.form": clickTemplateHandel,
  },
];
class TestView {
  constructor(context) {
    const view = vscode.window.createTreeView("pageTemplate", { treeDataProvider: treeDataProviderBuyComponent(), showCollapseAll: true });

    let add = vscode.commands.registerCommand("pageTemplate.add", async (arg) => {
      console.log(arg);
      let content = getFile(arg.fsPath);
      let fileName = await vscode.window.showInputBox({
        placeHolder: "请输入组件名称，保持名称不重复",
      });
      fileName += suffix;
      let filePath = path.resolve(templatePath, fileName);
      let isTemplate = fs.existsSync(filePath);
      if (!isTemplate) {
        writeFile(filePath, content);
        vscode.window.showErrorMessage("添加成功");
        //TODO 同步状态到左侧菜单栏
      } else {
        vscode.window.showErrorMessage("添加失败，已经存在相同名称");
      }
    });
    let deletes = vscode.commands.registerCommand("pageTemplate.item.delete", async (arg) => {
      console.log(arg, "模板删除");
    });

    registrationCommand(registerData);
    context.subscriptions.push(view);
    context.subscriptions.push(add);
    context.subscriptions.push(deletes);
  }
}

module.exports = {
  TestView,
};
