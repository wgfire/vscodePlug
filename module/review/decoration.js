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
/**
 * 每一个主题的所对应的颜色
 */
const DecorationTypes = {
  Perf: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted",
    borderColor: "#08AEEA",
    backgroundColor: "#08AEEA",
    color: "white",
  }),
  Bug: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted",
    borderColor: "#F76B1C",
    backgroundColor: "#F76B1C",
    color: "white",
  }),
  Format: window.createTextEditorDecorationType({
    border: "1px",
    borderStyle: "dotted",
    borderColor: "#FBAB7E",
    backgroundColor: "#ffcc00",
    color: "#1f1f1f",
  }),
};

class Decoration {
  constructor() {
    this.editor = window.activeTextEditor;

    this.regS = [/\.[Perf|Bug|Format]+/g, /(?<=\*@reviewContent(\s\S)?)([\S\s]*?)(?=\*\/)/g];

    this.timeout = null;

    this.reviewType = []; // 为review类型添加颜色

    this.reviewContent = []; // @ReviewContent内容添加颜色

    this.review = {};

    window.onDidChangeActiveTextEditor(() => {
      console.log(this.editor.document, "切换文件");

      this.editor = window.activeTextEditor;

      this.triggerUpdateDecorations();
    });

    workspace.onDidChangeTextDocument(() => {
      console.log(this.editor.document, "改变当前文件内容");

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
    this.findEditeContent();
    this.setDecoration();
  }
  init() {
    // 初始化数据。
    this.reviewType = [];
    this.reviewContent = [];
  }
  // 根据正则指定的内容
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

        const line = new Range(startPos, endPos);

        if (index === 0) type = doc.getText(line);

        console.log(type, "主题颜色");

        const decoration = {
          range: line,
        };

        const review = {
          type: type,
          decoration,
        };

        this.reviewType.push(review);
      }

      console.log("截取到的字符", this.reviewType);
    });
  }

  /**
   * 拿到rang数据设置背景颜色
   */
  setDecoration() {
    // 先对数组从小到大排序
    if (this.reviewType.length > 0) return false;
    this.reviewType.sort((a, b) => {
      return a.decoration.range._start._line - b.decoration.range._start._line;
    });

    let tempArray = [];
    // 以两两为一组
    for (let index = 0; index < this.reviewType.length; index += 2) {
      const element = this.reviewType[index];

      const next = this.reviewType[index + 1];

      const tempObj = {
        type: element.type,
        decoration: [element.decoration, next.decoration],
      };

      tempArray.push(tempObj);
    }

    tempArray.forEach((el) => {
      const DecorationType = DecorationTypes[el.type];

      this.editor.setDecorations(DecorationType, el.decoration);
    });

    console.log("rang范围", tempArray);
  }
}
module.exports = Decoration;
