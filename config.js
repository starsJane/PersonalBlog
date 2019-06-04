var fs = require("fs");

var globalConfig = {};

var conf = fs.readFileSync("./server.conf");

var configArr = conf.toString().split("\r\n");

// console.log(configArr); [ 'port=80', 'web_path=web' ]

for (var i = 0 ; i < configArr.length ; i ++) {
    globalConfig[configArr[i].split("=")[0].trim()] = configArr[i].split("=")[1].trim();
    // console.log(globalConfig);
    // { port: '80' }
    // { port: '80', web_path: 'web' }
}

module.exports = globalConfig;