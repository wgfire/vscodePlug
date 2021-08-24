/**
 * 为review代码添加文本颜色
 */
const vscode = require("vscode");
const { window, workspace, Range } = vscode;
const DecorationType = window.createTextEditorDecorationType({
  borderColor: vscode.ThemeColor,
  backgroundColor: vscode.ThemeColor,
  color: vscode.Color,
});
/**
 * 每一个主题的所对应的颜色
 */
const DecorationTypes = {
  Perf: {
    border: "1px",
    borderColor: "#08AEEA",
    backgroundColor: "#08AEEA",
    color: "white",
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  },
  Bug: {
    border: "1px",
    borderColor: "#F76B1C",
    backgroundColor: "#F76B1C",
    color: "white",
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  },
  Format: {
    border: "1px",
    borderColor: "#FBAB7E",
    backgroundColor: "#ffcc00",
    color: "#1f1f1f",
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  },
};

class Decoration {
  constructor() {
    this.editor = window.activeTextEditor;

    this.regS = [/(?<=\*@reviewType)\.(Perf|Bug|Format)?/g, /(?<=\*@reviewContent(\s\S)?)([\S\s]*?)(?=\*\/)/g];
    this.activeLine = {}
    this.timeout = null;

    this.reviewType = []; // 为review类型添加颜色

    this.reviewContent = []; // @ReviewContent内容添加颜色

    this.reviewDecoration = {};
    this.reviewContent.push(this.editor.document.fileName);
    this.createDecoration();
    window.onDidChangeActiveTextEditor(() => {
      console.log(this.editor.document, "切换文件");
      this.init();
      this.reviewContent.push(this.editor.document.fileName);
      this.reviewContent = [...new Set(this.reviewContent)];
      this.editor = window.activeTextEditor;
      console.log(this.reviewContent, "多个文件");
      this.triggerUpdateDecorations();
    });

    workspace.onDidChangeTextDocument((e) => {
      // console.log(this.editor.document, "改变当前文件内容");
      this.triggerUpdateDecorations(e.contentChanges[0].range);
      //this.DecNumber();
    });
  }
  // 防抖触发
  triggerUpdateDecorations(line) {
    // this.dispose();
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      this.activeLine = line
      this.Decoration();
    }, 2000);
  }
  Decoration() {
    this.findEditeContent();
    this.ConversionData();
  }
  createDecoration() {
    this.Perf = window.createTextEditorDecorationType({
      border: "1px",
      borderColor: "#08AEEA",
      backgroundColor: "#08AEEA",
      color: "white",
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
    this.Bug = window.createTextEditorDecorationType({
      border: "1px",
      borderColor: "#F76B1C",
      backgroundColor: "#F76B1C",
      color: "white",
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
    this.Format = window.createTextEditorDecorationType({
      border: "1px",
      borderColor: "#FBAB7E",
      backgroundColor: "#ffcc00",
      color: "#1f1f1f",
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
  }
  init() {
    // 初始化数据。
    //this.createDecoration();
    this.reviewType = [];
  }
  initDecoration() {
    console.log("清空");
    // let line = this.editor.document.lineCount;
    // this.editor.document.lineAt(line);
    // let rang = new Range(29, 0, 32, 2);
    // let dec = {
    //   range: rang,
    //   hoverMessage: "默认主题",
    // }
    // this.dispose();
    this.reviewType.forEach((el) => {
      //  DecorationType.dispose();
      console.log(el.decorationType, "x");
      this.editor.setDecorations(el.decorationType, []);
    });
  }
  /**
   * 根据起点找到是否有对应的内容
   */
  findContentBuyStart(line) {
    let result = {};
    const starts = line._start._line;
    const ends = line._end._character;

    let index = this.reviewType.findIndex((el) => {
      let start = el.decoration[0].range._start._line;
      let end = el.el.decoration[1].range._end._character;
      return starts <= start && ends <= end;
    });
    console.log(index, "找到的索引");
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
        let endLength = match.index + match[0].length;
        if (index > 0) endLength -= 2;
        const endPos = doc.positionAt(endLength);

        const line = new Range(startPos, endPos);
        const editeLine = this.editor.edit((e) => {
          console.log(e);
        });

        if (index === 0) type = doc.getText(line);

        console.log(type, "主题颜色");

        const decoration = {
          range: line,
          hoverMessage: "主题颜色" + type,
        };
        if (type) {
          this.findContentBuyStart(line);
          const review = {
            type: type,
            decoration,
          };

          this.reviewType.push(review);
        }
      }

      console.log("截取到的字符", this.reviewType);
    });
  }

  /**
   * 拿到rang数据设置背景颜色
   */
  ConversionData() {
    // 先对数组从小到大排序
    if (this.reviewType.length < 2) return false;
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
        decorationType: this[element.type],
      };

      tempArray.push(tempObj);
    }
    this.reviewType = tempArray;
    this.setDecorationToData();
  }

  setDecorationToData() {
    this.reviewType.forEach((el) => {
      //const DecorationType = DecorationTypes[el.type];
      //  DecorationType.dispose();
      //this.editor.setDecorations(el.decorationType, []);
      this.editor.setDecorations(el.decorationType, el.decoration);
    });

    console.log("rang范围", this.reviewType);
  }

  dispose() {
    this.reviewType.forEach((el) => {
      el.dispose();
    });
  }
}
module.exports = Decoration;
