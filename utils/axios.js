// @ts-nocheck
const Axios = require("axios");
const vscode = require("vscode");
const settings = vscode.workspace.getConfiguration("shared"); // 获取用户配置的信息

let contentType = {
  text: {
    msgtype: "text",
    text: {
      content: "结合vscode插件推送到代码片段到群机器人🤖",
      mentioned_list: ["王港"],
      mentioned_mobile_list: ["16607491196"],
    },
  },
  markdown: {
    msgtype: "markdown",
    markdown: {
      content: '实时新增用户反馈<font color="warning">132例</font>',
    },
  },
  news: {
    msgtype: "news",
    news: {
      articles: [
        {
          title: "中秋节礼品领取",
          description: "今年中秋节公司有豪礼相送",
          url: "www.baidu.com",
          picurl: "http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png",
        },
      ],
    },
  },
};

const axios = Axios.create({
  baseURL: settings.webhook || "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=6d3ec4c8-6e80-46d5-bb78-b593496cdf11",
});

function post(data) {
  let content = contentType[data.msgtype] 
  content[data.msgtype] = data.msgContent
  axios
    .post("", content)
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
