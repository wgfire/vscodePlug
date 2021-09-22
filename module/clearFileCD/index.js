const { isFileOrFolder } = require("../../utils/Regular");
const clearCD = require("../clearCD");
const fs = require("fs");

/**
 * 判断是否是文件还是文件夹
 * @param {*} path
 */
function initFile(path) {
  let fileArrays = [path];
  if (!isFileOrFolder(path)) {
    fileArrays = genFileList(path);
  }
  clearFiles(fileArrays);
}

function clearFiles(fileArray) {
  fileArray.forEach((file) => {
    clearCD(file);
  });
}
function genFileList(path) {
  var filesList = [];
  readFile(path, filesList);
  return filesList;
}

// 遍历读取文件
function readFile(path, filesList) {
  const files = fs.readdirSync(path); // 需要用到同步读取
  files.forEach((file) => {
    const filePath = path + "/" + file;
    const states = fs.statSync(filePath);
    // ❤❤❤ 判断是否是目录，是就继续递归
    if (states.isDirectory()) {
      readFile(filePath, filesList);
    } else {
      // 不是就将文件push进数组，此处可以正则匹配是否是 .js 先忽略
      const regFile = [/(\.js)$/, /(\.ts)$/, /(\.jsx)$/, /(\.tsx)$/, /(\.vue)$/];
      const result = regFile.some((el) => {
        console.log(filePath, "x");
        return el.test(filePath);
      });
      if (result) filesList.push(filePath);
      return filesList;
    }
  });
  console.log(filesList, "文件列表");
}

module.exports = initFile;
