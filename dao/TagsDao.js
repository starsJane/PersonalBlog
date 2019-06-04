// tag标题
var dbutil = require("./DBUtil");

// 查询tags表是否存在某一个tag标题, 没有就把blog表tag标题添加入tags表
function queyrTag(tag, success) {
    var insertSql = "select * from tags where tag = ?;";
    var params = [tag];
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

// 添加标题到tags表
function insertTag(tag, ctime, utime, success) {
    var insertSql = "insert into tags (`tag`, `ctime`, `utime`) values (?, ?, ?)";
    var params = [tag, ctime, utime];

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


// 随机标签云 查询全部tag标题
function queyrAllTag(success) {
    var insertSql = "select * from tags;";
    var params = [];
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




module.exports.insertTag = insertTag;
module.exports.queyrTag = queyrTag;
module.exports.queyrAllTag = queyrAllTag;