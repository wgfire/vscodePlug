const vscode = require("vscode");
/**
 * 自动提示实现，
 * @param {*} document
 * @param {*} position
 * @param {*} token
 * @param {*} context
 */
function provideCompletionItems(document, position, token, context) {
  const line = document.lineAt(position);
  //const projectPath = util.getProjectPath(document);

  // 只截取到光标位置为止，防止一些特殊情况
  const lineText = line.text.substring(0, position.character);
  // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
  if (/@review\.$/g.test(lineText)) {
    console.log("字符串注册",lineText);
    //const json = require(`${projectPath}/package.json`);
    const dependencies = ["Bugs", "optimization", "specification"]; //Object.keys(json.dependencies || {}).concat(Object.keys(json.devDependencies || {}));
    //   return [new vscode.CompletionItem("@review", vscode.CompletionItemKind.Snippet)];
    return dependencies.map((dep) => {
      // vscode.CompletionItemKind 表示提示的类型
      console.log(dep);
      return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
    });
  }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item
 * @param {*} token
 */
function resolveCompletionItem(item, token) {
  return null;
}

module.exports = function (context) {
  // 注册代码建议提示，只有当按下“.”时才触发
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "javascript",
      {
        provideCompletionItems,
        resolveCompletionItem,
      },
      "."
    )
  );
};
