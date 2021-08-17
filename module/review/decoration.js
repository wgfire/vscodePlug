/**
 * 为review代码添加文本颜色
 */
const vscode = require("vscode");
const { window, workspace, Range } = vscode;
const DecorationType = window.createTextEditorDecorationType({
  border: "1px",
  borderStyle: "solid",
  borderColor: "#fff",
  backgroundColor: "blue",
});
class Decoration {
  constructor() {
    this.editor = window.activeTextEditor;
    this.regS = /(\*@reviewContent)\s+(.*\s)+(\*\/)/g    ///\w*-- Perf/g;
    this.timeout = null;
    this.reviewType = []; // 为review类型添加颜色
    this.reviewContent = []; // @ReviewContent内容添加颜色
    window.onDidChangeActiveTextEditor(() => {
      console.log(this.editor.document, "文本内容1");
      this.editor = window.activeTextEditor;
      this.triggerUpdateDecorations();
    });

    workspace.onDidChangeTextDocument(() => {
      console.log(this.editor.document, "文本内容2");
      this.triggerUpdateDecorations();
      //this.DecNumber();
    });
  }
  // 防抖触发
  triggerUpdateDecorations() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      this.Decoration();
    }, 1000);
  }
  Decoration() {
    this.init();
    this.setDecoration();
  }
  init() {
    // 初始化找到的内容
    this.reviewType = this.reviewType.splice();
    this.reviewContent = this.reviewContent.splice();
  }
  // 获取正则指定的内容
  findEditeContent() {
    // 获取当前文档的全部信息
    let doc = this.editor.document;
    let text = doc.getText();
    let match;
  
    while ((match = this.regS.exec(text))) {
      // 获取数字开始和结束的位置
      const startPos = doc.positionAt(match.index);
      const endPos = doc.positionAt(match.index + match[0].length);
      const line = new vscode.Position(match.index,match.index + match[0].length)
      console.log("开始寻找",line);
      // 下面有截图 主要是获取数字的位置范围，并且当鼠标覆盖时，有我们想要的文字展示
      const decoration = {
        range: new Range(startPos, endPos),
      };
      this.reviewType.push(decoration);
    }
    console.log("截取到的字符", this.reviewType);
  }

  setDecoration() {
    this.findEditeContent();
    this.editor.setDecorations(DecorationType, this.reviewType);
  }
}
module.exports = Decoration;
