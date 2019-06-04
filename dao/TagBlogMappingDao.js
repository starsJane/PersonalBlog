var dbutil = require("./DBUtil");

// 插入tagId, blogId到tag_blog_mapping表格
function insertTagBlogMapping(tagId, blogId, ctime, utime, success) {
    var insertSql = "insert into tag_blog_mapping (`tag_id`, `blog_id`, `ctime`, `utime`) values (?, ?, ?, ?)";
    var params = [tagId, blogId, ctime, utime];

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



// 用tag找到blog_id
// 随机标签云 点击标签获取有tag参数对应文章
function queryByTag(tagId, page, pageSize, success) {
    var insertSql = "select * from tag_blog_mapping where tag_id = ? limit ?, ?;";
    var params = [tagId, page * pageSize, pageSize];

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


// 随机标签云 有tag参数分页总数  根据tagId获取符合条件的blogId总数
function queryByTagCount(tagId, success) {
    var insertSql = "select count(1) as count from tag_blog_mapping where tag_id = ?;";
    var params = [tagId];

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


module.exports.insertTagBlogMapping = insertTagBlogMapping;
module.exports.queryByTag = queryByTag;
module.exports.queryByTagCount = queryByTagCount;