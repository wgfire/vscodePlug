/**
 * 为review代码添加文本颜色
 */
const vscode = require("vscode");
const { window, workspace } = vscode;

class Decoration {
  constructor() {
    this.editor = window.activeTextEditor;
    this.timeout = null;
    window.onDidChangeActiveTextEditor(() => {
      this.editor = window.activeTextEditor;
    });

    workspace.onDidChangeTextDocument(() => {
      this.triggerUpdateDecorations();
      //this.DecNumber();
    });
  }
  triggerUpdateDecorations() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      console.log(this.editor, "文本内容2");
    }, 1000);
  }
}
module.exports = Decoration;
