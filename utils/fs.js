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
function unlink(filePath) {
  try {
    let result = fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    throw new Error("删除文件失败" + filePath);
  }
}
function rename(oldPath, newPath) {
  try {
    fs.renameSync(oldPath, newPath);
  } catch (error) {
    throw new Error("重命名文件失败" + oldPath);
  }
}
function copyFile(src, desc) {
  console.log(src, desc, "复制路径");
  try {
    fs.copyFileSync(src, desc);
  } catch (error) {
    throw new Error("复制文件失败" + src);
  }
}
module.exports = {
  getFile,
  writeFile,
  unlink,
  rename,
  copyFile,
};
