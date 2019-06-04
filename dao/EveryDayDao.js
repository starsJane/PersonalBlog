var dbutil = require("./DBUtil");

// 添加每日一句到every_day表
function insertEveryDay(content, ctime, success) {
    var insertSql = "insert into every_day (`content`, `ctime`) values (?, ?)";
    var params = [content, ctime];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

// 按照倒叙查找每日一句
function queryEveryDay(success) {
    var querySql = "select * from every_day order by id desc limit 1;";     // 倒叙且限制一条
    var params = [];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports.insertEveryDay = insertEveryDay;
module.exports.queryEveryDay = queryEveryDay;