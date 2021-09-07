/**
 * 为review代码添加文本颜色
 */
const path = require("path");
const vscode = require("vscode");
const { writeFile } = require("../../utils/fs");
const { window, workspace, Range } = vscode;
const { TreeReview } = require("../TreeReview/index");
const rootPath = vscode.workspace.rootPath;
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
    this.TreeRivew = new TreeReview();
    this.regS = [/(?<=\*@reviewType)\.(Perf|Bug|Format)?/g, /(?<=\*@reviewContent(\s\S)?)([\S\s]*?)(?=\*\/)/g];
    this.activeLine = {}; // 当前操作的行
    this.timeout = null;

    this.reviewDecoration = []; // 为review类型添加颜色
    this.actionType = ""; // 当前操作是更新已有的 还是新增 /删除
    this.activeReview = {}; // 当前操作的行 所拿到的这个review数据  ｛｝|| undefiend

    this.reviewContent = []; // @ReviewContent内容添加颜色
    this.decorationList = [];
    this.editor && this.reviewContent.push(this.editor.document.fileName);
    this.status = false;
    console.log(this.reviewContent, "当前文件列表");
    window.onDidChangeActiveTextEditor(() => {
      this.editor = window.activeTextEditor;
      this.reviewContent = [...new Set(this.reviewContent), this.editor.document.fileName];
      console.log(this.reviewContent, "多个文件");
      this.triggerUpdateDecorations();
    });

    workspace.onDidOpenTextDocument(() => {
      this.triggerUpdateDecorations();
    });
    workspace.onDidChangeTextDocument((e) => {
      this.activeLine = e.contentChanges[0].range;
      console.log(this.activeLine, "当前操作行");
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
    }, 20);
  }
  Decoration() {
    this.init();
    // this.findContentBuyStart();
    this.findEditeContent();
    this.setDecorationToData();
  }

  init() {
    // 初始化数据。
    this.clearDecorationToData();
  }

  // 根据正则指定的内容
  findEditeContent() {
    // 获取当前文档的全部信息
    let doc = this.editor.document;

    let text = doc.getText();

    let match;

    let empty = true;

    this.regS.forEach((reg, index) => {
      let type = "Perf";
      while ((match = reg.exec(text))) {
        // 获取数字开始和结束的位置
        const startPos = doc.positionAt(match.index + 1);
        let endLength = match.index + match[0].length;
        empty = false;
        if (index > 0) endLength -= 2;

        const endPos = doc.positionAt(endLength);

        const line = new Range(startPos, endPos);

        if (index === 0) type = doc.getText(line);

        const decoration = {
          range: line,
          hoverMessage: "主题颜色" + type,
        };
        if (type) {
          const review = {
            type: type,
            decoration,
          };
          this.reviewDecoration.push(review);
        }
      }
    });
    if (empty) this.reviewDecoration = [];
    console.log("收集的review", this.reviewDecoration);
  }

  /**
   * 拿到rang数据设置背景颜色
   */
  ConversionData() {
    // 先对数组从小到大排序
    // if (this.reviewDecoration.length < 2) return false;
    this.reviewDecoration.sort((a, b) => {
      return a.decoration.range._start._line - b.decoration.range._start._line;
    });

    let tempArray = [];
    // 以两两为一组
    for (let index = 0; index < this.reviewDecoration.length; index += 2) {
      const element = this.reviewDecoration[index];

      const next = this.reviewDecoration[index + 1];

      const tempObj = {
        type: element.type,
        decoration: [element.decoration, next.decoration],
        decorationType: window.createTextEditorDecorationType(DecorationTypes[element.type]),
      };
      this.decorationList.push(tempObj.decorationType);
      tempArray.push(tempObj);
    }
    this.reviewDecoration = tempArray;
    return tempArray;
  }

  setDecorationToData() {
    let tempArray = this.ConversionData();
    tempArray.forEach((el) => {
      this.editor.setDecorations(el.decorationType, el.decoration);
    });

    console.log(tempArray, "渲染数组");

    this.updateTreeReview(tempArray);
  }

  updateTreeReview(tempArray) {
    // @ts-ignore
    const Tree = require("../TreeReview/reviewData.json");

    if (tempArray.length == 0) {
      //  删除treejson里的数据;
      let fileName = this.editor.document.fileName;
      fileName = fileName.match(/\w+\\\w+\w+-?\w+(\.\w+)/g)[0];
      console.log(fileName, "删除的文件");
      Object.keys(Tree).forEach((el) => {
        if (fileName === el) {
          delete Tree[el];
        }
      });
    } else {
      // 判断json里有没有这个文件 没有的话加上

      let filePath = this.editor.document.fileName;
      let fileName = filePath.match(/\w+\\\w+\w+-?\w+(\.\w+)/g)[0];
      let result = Object.keys(Tree).some((el) => {
        return el === fileName;
      });
      if (!result) {
        Tree[fileName] = {
          filePath: filePath,
          reviewNum: 1,
          rootPath:rootPath
        };
      }
    }
    console.log("生成的tree", Tree);
    writeFile(path.resolve(__dirname, "../TreeReview/reviewData.json"), JSON.stringify(Tree));
    this.TreeRivew.initTree();
  }

  findActiveData() {
    try {
      const starts = this.activeLine._start._line;
      let index = this.reviewDecoration.findIndex((el) => {
        let start = el.decoration[0].range._start._line;
        let end = el.decoration[1].range._end._line;
        return start <= starts && starts <= end;
      });

      return index;
    } catch (error) {}
  }

  clearDecorationToData() {
    // let index = this.findActiveData();
    this.reviewDecoration = [];
    // TODO 清空当前的review范围，当前是多个review都会被清空一次
    this.decorationList.forEach((el) => {
      this.editor.setDecorations(el, []);
    });
    this.decorationList = [];
  }

  dispose() {
    this.reviewDecoration.forEach((el) => {
      el.dispose();
    });
  }
}
module.exports = Decoration;
