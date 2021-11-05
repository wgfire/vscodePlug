const vscode = require("vscode");
const { nodeWithIdTreeDataProvider, createRegisterData } = require("./componentProvider");
const { registrationCommand } = require("../../utils/common");

/**
 * 获取到地址，然后利用新窗口打开文件
 */
async function clickTemplateHandel(params) {
  console.log("点击了review列表", params);

  // vscode.commands.executeCommand() 执行内置命令
  vscode.workspace.openTextDocument(vscode.Uri.file(params.filePath)).then(
    (res) => {
      vscode.window.showTextDocument(res);
      console.log(res, "打开成功");
    },
    (reject) => {
      vscode.window.showErrorMessage("文件打开失败");
    }
  );
}
class TreeReview {
  constructor(context) {
    this.context = context;
    this.initTree();
    console.log("初始化review");
  }

  initTree() {
    const registerData = createRegisterData(clickTemplateHandel);
    registrationCommand(registerData);
    vscode.window.createTreeView("reviewHistory", { treeDataProvider: nodeWithIdTreeDataProvider(), showCollapseAll: true });
  }
}

module.exports = {
  TreeReview,
};
