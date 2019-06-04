var dbutil = require("./DBUtil");

// 添加评论
function insertComment(blogId, parent, parentName, userName, email, comments, ctime, utime, success) {
    var insertSql = "insert into comments (`blog_id`, `parent`, `parent_name`, `user_name`, `email`, `comments`, `ctime`, `utime`) values (?, ?, ?, ?, ?, ?, ?, ?)";
    var params = [blogId, parent, parentName, userName, email, comments, ctime, utime];

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


// 查找回复留言哪篇文章的Id（从评论里拿出数据来显示在留言回复区）
function queryCommentsByBlogId(blogId, success) {
    var querySql = "select * from comments where blog_id = ?;";
    var params = [blogId];
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


// 获取留言数量 求总数
function queryCommentCountByBlogId(blogId, success) {
    var querySql = "select count(1) as count from comments where blog_id = ?;";
    var params = [blogId];
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




// 获取最新评论   按照浏览次数倒叙排order by id desc   限制展示条数size
function queryNewComments(size, success) {
    var querySql = "select * from comments order by id desc limit ?;";
    var params = [size];
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


module.exports.insertComment = insertComment;
module.exports.queryCommentsByBlogId = queryCommentsByBlogId;
module.exports.queryCommentCountByBlogId = queryCommentCountByBlogId;
module.exports.queryNewComments = queryNewComments;