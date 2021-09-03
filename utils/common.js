const vscode = require("vscode");
function registrationCommand(arg) {
  if (!Array.isArray(arg)) throw new Error("请传入数组");
  let register = arg;
  register.forEach((el) => {
    const key = Object.keys(el)[0];
    let result = vscode.commands.registerCommand(key, el[key]);
    el.result = result;
  });
  return register;
}

module.exports = {
  registrationCommand,
};
