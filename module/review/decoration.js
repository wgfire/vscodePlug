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
    this.activeLine = {};
    this.timeout = null;

    this.reviewType = []; // 为review类型添加颜色

    this.reviewContent = []; // @ReviewContent内容添加颜色

    this.reviewDecoration = {};
    this.reviewContent.push(this.editor.document.fileName);

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
      this.activeLine = e.contentChanges[0].range;
      this.triggerUpdateDecorations();
      //this.DecNumber();
    });
  }
  // 防抖触发
  triggerUpdateDecorations() {
    // this.dispose();
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(() => {
      this.Decoration();
    }, 2000);
  }
  Decoration() {
    this.init();
    this.findEditeContent();
    //  this.setDecorationToData();
  }

  init() {
    // 初始化数据。
    //this.createDecoration();
    this.reviewType = [];
  }
  initDecoration() {
    console.log("清空");
    this.reviewType.forEach((el) => {
      //  DecorationType.dispose();
      console.log(el.decorationType, "x");
      this.editor.setDecorations(el.decorationType, []);
    });
  }
  /**
   * 根据起点找到是否有对应的内容
   */
  findContentBuyStart(line, type) {
    console.log("当前line", line, type);
    const starts = line._start._line;
    const ends = line._end._character;

    let index = this.reviewType.findIndex((el) => {
      let start = el.decoration.range._start._line;
      return starts <= start;
    });
    console.log(index, "找到的索引");
    if (index > -1) this.reviewType[index].type = type;
    return index > -1 ? this.reviewType[index] : undefined;
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

        if (index === 0) type = doc.getText(line);

        console.log(type, "主题颜色", index);

        const decoration = {
          range: line,
          hoverMessage: "主题颜色" + type,
        };
        if (type) {
          const review = {
            type: type,
            decoration,
          };
          // if (this.reviewType.length >= 2) {
          //   let result = this.findContentBuyStart(this.activeLine, type);
          //   if (!result) this.reviewType.push(review);
          // } else {
          this.reviewType.push(review);
          // }
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
        decorationType: window.createTextEditorDecorationType(DecorationTypes[element.type]),
      };

      tempArray.push(tempObj);
    }

    return tempArray;
  }

  setDecorationToData() {
    let tempArray = this.ConversionData();
    tempArray.forEach((el) => {
      //const DecorationType = DecorationTypes[el.type];
      //  DecorationType.dispose();
      //this.editor.setDecorations(el.decorationType, []);
      this.editor.setDecorations(el.decorationType, el.decoration);
    });

    console.log("rang范围", tempArray);
  }

  dispose() {
    this.reviewType.forEach((el) => {
      el.dispose();
    });
  }
}
module.exports = Decoration;
