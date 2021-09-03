const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const strUtils = require("./string");

function writeFile(path, content) {
  try {
    console.log("写入的路径", path);
    let result = fs.writeFileSync(path, content, { encoding: "utf-8" });
    // let result = vscode.workspace.fs.writeFile(vscode.Uri.file(path), strUtils.stringToUint8Array(content));
    return result;
  } catch (error) {
    throw new Error("写入失败");
  }
}
function getFile(filePath) {
  // filePath = path.resolve(__dirname, "../module/TreeData/componentProvider/template/test.txt");
  try {
    const result = fs.readFileSync(filePath, "utf-8");
    return result;
  } catch (error) {
    throw new Error("写入失败");
  }
}

module.exports = {
  getFile,
  writeFile,
};
