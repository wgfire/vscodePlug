// @ts-nocheck
const Axios = require("axios");

let content = {
  msgtype: "text",
  text: {
    content: "结合vscode插件推送到代码片段到群机器人🤖",
    mentioned_list: ["王港"],
    mentioned_mobile_list: ["16607491196"],
  },
};
const axios = Axios.create({
  baseURL: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=6d3ec4c8-6e80-46d5-bb78-b593496cdf11",
});



function post(data = content) {
  axios
    .post("", data)
    .then(function (response) {
      console.log(response, "响应");
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = {
  post,
};
