/** 2022年/5月/11日/星期三
*@reviewType.Perf
*@reviewContent By Name
1.将classNames模块改名为styles.classNames
*/
const { getFile } = require("../../utils/fs");
const { writeFileSync } = require("fs");
const { window } = require("vscode");
/**
 * @description
 * 读取这个文件，找到所有classNames="xx"的片段 然后替换成 styles.classNames
 * @param {*} edite
 */
module.exports = function (edite) {
  console.log(edite, "x");
  const reg = /className="([^"]+)"/g;
  const file = getFile(edite._fsPath);
  if (file) {
    let result = file.replace(reg, (match, $1) => {
      return `className={styles.${$1}}`;
    });
    console.log(result);
    writeFileSync(edite._fsPath, result, { encoding: "utf-8" });
    window.showInformationMessage("classNames替换成功");
  }
};
