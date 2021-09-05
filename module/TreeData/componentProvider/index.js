/**
 * 为组件模板提供树形列表
 */
const path = require("path");
const vscode = require("vscode");
const iconPath = path.join(__filename, "../../../../static/svg/components.svg");
const { TreeDate } = require("./data");
let copyRegister = [];
function nodeWithIdTreeDataProvider() {
  return {
    getChildren: (element) => {
      // 判断上级是否有父级节点，root根节点不算undefine
      console.log(element, "根节点");
      let children = [];
      // let TreeData = providerData()
      const providerDatas = TreeDate();
      for (let index = 0; index < providerDatas.length; index++) {
        const element = providerDatas[index];
        var item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        item.command = element.command;
        item.iconPath = iconPath;
        item.id = element.id;
        children[index] = item;
      }
      return children;
    },
    getTreeItem: (element) => {
      return element;
    },
  };
}

function createRegisterData(handel) {
  let result = [];
  const providerDatas = TreeDate();
  result = providerDatas.map((el) => {
    let command = el.command.command;
    let handeObj = {};
    handeObj[command] = handel;
    return handeObj;
  });
  copyRegister = result;
  return result;
}

module.exports = {
  nodeWithIdTreeDataProvider,
  createRegisterData,
};
