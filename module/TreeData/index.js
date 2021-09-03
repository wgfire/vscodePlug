const vscode = require("vscode");
const path = require("path");
const treeDataProviderBuyComponent = require('./componentProvider')
class TestView {
  constructor(context) {
    // @ts-ignore
    const view = vscode.window.createTreeView("pageTemplate", { treeDataProvider: treeDataProviderBuyComponent(), showCollapseAll: true });
    context.subscriptions.push(view);
    let add = vscode.commands.registerCommand("pageTemplate.add", async (arg) => {
      console.log(arg, "模板添加");
    });

    let deletes = vscode.commands.registerCommand("pageTemplate.item.delete", async (arg) => {
      console.log(arg, "模板删除");
    });

    vscode.commands.registerCommand("pageTemplate.form", async (arg) => {
      console.log("点击了表单组件", arg);
    });
    context.subscriptions.push(add);
    context.subscriptions.push(deletes);
  }
}

function aNodeWithIdTreeDataProvider() {
  return {
    getChildren: (element) => {
      // 判断上级是否有父级节点，root根节点不算undefine
      console.log(element, "根节点");
      var childs = [];
      for (let index = 0; index < 3; index++) {
        const element = index.toString();
        var item = new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.None);
        item.command = {
          command: "pageTemplate." + element,
          title: "测试" + element,
          arguments: [element + "参数"],
        };
        //  item.id = "pageTemplate." + element;
        item.iconPath = path.join(__filename, "../../../static/svg/components.svg");
        //item.tooltip = "模板啊";
        childs[index] = item;
      }
      return childs;
    },
    getTreeItem: (element) => {
      return element;
    },
  };
}

module.exports = {
  TestView,
};
