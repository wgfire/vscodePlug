const isFileOrFolder = function (path) {
  /**判断是文件还是文件夹 */
  const reg = /(\.\w+)$/;
  return reg.test(path);
};


module.exports = {
  isFileOrFolder,
};
/**
 * 
 */