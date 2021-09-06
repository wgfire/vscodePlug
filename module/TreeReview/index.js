const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

const { nodeWithIdTreeDataProvider, createRegisterData } = require("./componentProvider");
const { getFile, writeFile, unlink } = require("../../utils/fs");
const { registrationCommand } = require("../../utils/common");

async function pageTemplateDelete(initTree) {}
async function clickTemplateHandel(params) {
  console.log("点击了review列表", params);
  /**
   * 获取到地址，然后打开文件
   */
}

class TreeReview {
  constructor(context) {
    this.context = context;
    this.initTree();
    console.log("初始化review");
    pageTemplateDelete(this.initTree);
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
