/**判断是文件还是文件夹  true为文件 false为文件夹*/
const isFileOrFolder = function (path) {
  const reg = /(\.\w+)$/;
  return reg.test(path);
};

module.exports = {
  isFileOrFolder,
};
/**
 *
 */
