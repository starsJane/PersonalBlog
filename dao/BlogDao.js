var dbutil = require("./DBUtil");

// 添加博客文章到blog表
function insertBlog(title, content, tags, views, ctime, utime, success) {
    var insertSql = "insert into blog (`title`, `content`, `tags`, `views`, `ctime`, `utime`) values (?, ?, ?, ?, ?, ?)";
    var params = [title, content, tags, views, ctime, ctime];

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

// 查询博客文章
function queryBlogByPage(page, pageSize, success) {
    var insertSql = "select * from blog order by id desc limit ?, ?;";  // 按倒叙，限制
    var params = [page * pageSize, pageSize];   //第一个参数是偏移量，第二个是取多少[0, 5]  [5, 5]...

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


// 分页功能——查找文章篇数
function queryBlogCount(success) {
    var querySql = "select count(1) as count from blog;";
    // count(1),其实就是计算一共有多少符合条件的行。 1并不是表示第一个字段,而是表示一个固定值
    // as count 指给选出的结果起名为count
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



// 查询详情页文章的id
function queryBlogById(id, success) {
    var querySql = "select * from blog where id = ?;";
    var params = [id];

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


// 地图页 倒叙查询获取所有要跳转的文章（最新的排在最前面）
function queryAllBlog(success) {
    var querySql = "select * from blog order by id desc;";
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



// 每次请求文章浏览数都+1
function addViews(id, success) {
    var querySql = "update blog set views = views + 1 where id = ?;";
    var params = [id];

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



// 获取最近热门文章  按照浏览次数倒叙排order by views desc   限制展示条数size
function queryHotBlog(size, success) {
    var querySql = "select * from blog order by views desc limit ?;";
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

module.exports.insertBlog = insertBlog;
module.exports.queryBlogByPage = queryBlogByPage;
module.exports.queryBlogCount = queryBlogCount;
module.exports.queryBlogById = queryBlogById;
module.exports.queryAllBlog = queryAllBlog;
module.exports.addViews = addViews;
module.exports.queryHotBlog = queryHotBlog;