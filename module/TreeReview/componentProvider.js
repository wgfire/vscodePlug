const vscode = require("vscode");
const path = require("path");
const iconPath = path.join(__filename, "../../../../static/svg/components.svg");

function createTree() {
  // @ts-ignore
  const reviewData = require("./reviewData.json");
  let result = [];
  result = Object.keys(reviewData).map((element) => {
    let fileName = element; //element.match(/\w+(\.\w+)/g);
    const TreeItem = {
      label: fileName,
      id: fileName,
      command: {
        command: "review." + fileName,
        title: fileName,
        arguments: [
          {
            fileName: fileName,
            filePath: reviewData[element].filePath,
          },
        ],
      },
      collapsible: "None",
    };
    return TreeItem;
  });
  return result;
}
function nodeWithIdTreeDataProvider() {
  return {
    getChildren: (element) => {
      // 判断上级是否有父级节点，root根节点不算undefine
      console.log(element, "根节点");
      let children = [];
      // let TreeData = providerData()
      const providerData = createTree();
      for (let index = 0; index < providerData.length; index++) {
        const element = providerData[index];
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
  const providerData = createTree();
  result = providerData.map((el) => {
    let command = el.command.command;
    let handeObj = {};
    handeObj[command] = handel;
    return handeObj;
  });
  return result;
}

module.exports = {
  nodeWithIdTreeDataProvider,
  createRegisterData,
};
