const vscode = require("vscode");
const path = require("path");
const treeDataProviderBuyComponent = require("./componentProvider");
const { registrationCommand } = require("../../utils/common");
const openWritePath = "";
async function pageTemplateAdd(params) {}
async function pageTemplateDelete(params) {}
async function clickTemplateHandel(params) {
  console.log("点击了列表组件", params);
  /**
   * 获取模板然后写入到当前的文件地址
   */
}
const registerData = [
  {
    "pageTemplate.form": clickTemplateHandel,
  },
];
class TestView {
  constructor(context) {
    // @ts-ignore
    //console.log("当前工作", vscode.workspace.textDocuments,  "x");

    console.log('当前编辑的路径',vscode.window.visibleTextEditors);

    const view = vscode.window.createTreeView("pageTemplate", { treeDataProvider: treeDataProviderBuyComponent(), showCollapseAll: true });
    context.subscriptions.push(view);
    let add = vscode.commands.registerCommand("pageTemplate.add", async (arg) => {
      console.log(arg, "模板添加");
    });
    let deletes = vscode.commands.registerCommand("pageTemplate.item.delete", async (arg) => {
      console.log(arg, "模板删除");
    });

    registrationCommand(registerData);
    context.subscriptions.push(add);
    context.subscriptions.push(deletes);
  }
}

module.exports = {
  TestView,
};
