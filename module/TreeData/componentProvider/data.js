const fs = require("fs");
const path = require("path");
const templateFile = path.resolve(__dirname, "template");

const treeItem = {
  label: "表单组件",
  id: "form",
  command: {
    command: "pageTemplate.form",
    title: "表单组件",
    arguments: [
      {
        content: "",
        fileName: "test",
      },
    ],
  },
  collapsible: "None",
};

const TreeDate = function () {
  let data = createTreeData();
  return data;
};

function createItem(fileName) {
  let name = fileName.slice(0, -4);
  return {
    label: name + "模板",
    id: name,
    command: {
      command: "pageTemplate." + name,
      title: name + "模板",
      arguments: [
        {
          fileName: fileName,
        },
      ],
    },
    collapsible: "None",
  };
}

/**
 * 根据template里的文件生成 treeData树
 */
function createTreeData() {
  let result = [];
  let file = fs.readdirSync(templateFile);
  result = file.map((name) => {
    return createItem(name);
  });
  return result;
}

module.exports = {
  TreeDate,
};
