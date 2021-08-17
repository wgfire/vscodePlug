/**
 * 为review代码添加文本颜色
 */
const vscode = require("vscode");
const { window, workspace, Range } = vscode;
const DecorationType = window.createTextEditorDecorationType({
  border: "1px",
  borderStyle: "dotted", //"solid",
  borderColor: "#52ACFF",
  backgroundColor: "#52ACFF",
  color: "white",
});

const DecorationTypes = {
  Perf: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted", //"solid",
    borderColor: "#08AEEA",
    backgroundColor: "#08AEEA",
    color: "white",
  }),
  Bug: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted", //"solid",
    borderColor: "#F76B1C",
    backgroundColor: "#F76B1C",
    color: "white",
  }),
  Format: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted", //"solid",
    borderColor: "#FBAB7E",
    backgroundColor: "#FBAB7E",
    color: "white",
  }),
};

class Decoration {
  constructor() {
    this.editor = window.activeTextEditor;
    this.regS = [/\.[Perf|Bug|Format]+/g, /(?<=\*@reviewContent(\s\S)?)([\S\s]*?)(?=\*\/)/g]; ///\w*-- Perf/g;
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

    this.regS.forEach((reg, index) => {
      let type = "Perf";

      while ((match = reg.exec(text))) {
        // 获取数字开始和结束的位置
        const startPos = doc.positionAt(match.index + 1);
        const endPos = doc.positionAt(match.index + match[0].length);
        const line = new vscode.Position(match.index, match.index + match[0].length);
        console.log("开始寻找", doc.getText(new Range(startPos, endPos)));
        // 当匹配第一个的时候 确定当前的主题色
        if (index === 0) type = doc.getText(new Range(startPos, endPos));
        const decoration = {
          range: new Range(startPos, endPos),
        };
        // this.review = {
        //   type: DecorationTypes[type] ? DecorationTypes[type] : DecorationTypes["Perf"],
        //   rangs: [],
        // };
        this.reviewType.push(decoration);
      }

      console.log("截取到的字符", this.reviewType);
    });
  }

  setDecoration() {
    this.findEditeContent();
    // this.reviewType.forEach((el) => {
    //   this.editor.setDecorations(el.type, el.rangs);
    // });
    this.editor.setDecorations(DecorationType, this.reviewType);
  }
}
module.exports = Decoration;
