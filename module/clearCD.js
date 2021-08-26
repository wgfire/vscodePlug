/**
 * 清空console 和 debugger
 */
const strUtils = require("../utils/string");
const vscode = require("vscode");
// @ts-ignore
const TextEncoder = require("fast-text-encoding");

const clearCd = (editor) => {
  // 获取用户文本内容
  console.log(editor.document, "文本内容");
  let Text = editor.document.getText();
  const reg = /(console\.log(.*);?)|(debugger\S*)/g;
  let writeText = Text.replace(reg, "");
  console.log(writeText, "清空的");
  // editor.document.set;
  vscode.workspace.fs.writeFile(vscode.Uri.file(editor.document.fileName), strUtils.stringToUint8Array(writeText));
};

module.exports = clearCd;

// const text = `
// export const GET_WEBSITE_CONFIG = 'app/';
// export function getWebsiteConfig() {}

// console.log('xxx');
// debugger
// `;
// console.log(text.match(/^.*[console.log('\S')]/));

// console.log(
//   text.replace(/(console\.log(.*))|(debugger)/g, (str) => {
//     console.log(str, "匹配到");
//     return "";
//   })
// );
