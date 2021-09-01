const vscode = require("vscode");

class TestView {
  constructor(context) {
    // @ts-ignore
    const view = vscode.window.createTreeView("pageTemplate", { treeDataProvider: aNodeWithIdTreeDataProvider(), showCollapseAll: true });
    context.subscriptions.push(view);
    vscode.commands.registerCommand("testView.reveal", async () => {
      // const key = await vscode.window.showInputBox({ placeHolder: 'Type the label of the item to reveal' });
      // if (key) {
      // 	await view.reveal({ key }, { focus: true, select: false, expand: true });
      // }
    });
    vscode.commands.registerCommand("testView.changeTitle", async () => {
      // const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View', placeHolder: view.title });
      // if (title) {
      // 	view.title = title;
      // }
    });
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
          command: "money" + element,
          title: "测试" + element,
          arguments: [element + "参数"],
        };
        childs[index] = item;
      }
      return childs;
    },
    getTreeItem: (element) => {
      return element;
    },
    // getParent: ({ key }) => {
    //   const parentKey = key.substring(0, key.length - 1);
    //   return parentKey ? new Key(parentKey) : void 0;
    // },
  };
}

module.exports = {
  TestView,
};
