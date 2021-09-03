/**
 * 为组件模板提供树形列表
 */
const path = require("path");
const vscode = require("vscode");
const iconPath = path.join(__filename, "../../../../static/svg/components.svg");
const providerData = require("./data");
function aNodeWithIdTreeDataProvider() {
  return {
    getChildren: (element) => {
      // 判断上级是否有父级节点，root根节点不算undefine
      console.log(element, "根节点");
      let childs = [];
      for (let index = 0; index < providerData.length; index++) {
        const element = providerData[index];
        var item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState[element.collapsible]);
        item.command = element.command;
        item.iconPath = iconPath;
        item.id = element.id;
        childs[index] = item;
      }
      return childs;
    },
    getTreeItem: (element) => {
      return element;
    },
  };
}

module.exports = aNodeWithIdTreeDataProvider;
