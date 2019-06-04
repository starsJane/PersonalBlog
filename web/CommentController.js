var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var commentDao = require("../dao/CommentDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");

// 引入captcha生成验证码工具
var captcha = require("svg-captcha");

var url = require("url");

var path = new Map();


// 添加评论
function addComment(request, response) {
    var params = url.parse(request.url, true).query;

    commentDao.insertComment(parseInt(params.bid), parseInt(params.parent), params.parentName, params.userName, params.email, params.content, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", null));
        response.end();
    });
}
path.set("/addComment", addComment);



// 生成验证码， 没有用Dao数据库
function queryRandomCode(request, response) {
    var img = captcha.create({fontSize: 50, width: 100, height: 34});
    response.writeHead(200);
    response.write(respUtil.writeResult("success", "评论成功", img));
    response.end();
}
path.set("/queryRandomCode", queryRandomCode);



// 查找回复留言哪篇文章的Id（从评论里拿出数据来显示在留言回复区）
function queryCommentsByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentsByBlogId(parseInt(params.bid), function(result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", result));
        response.end();
    });
}
path.set("/queryCommentsByBlogId", queryCommentsByBlogId);



// 获取留言数量 求总数
function queryCommentsCountByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentCountByBlogId(parseInt(params.bid), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", result));
        response.end();
    });
}
path.set("/queryCommentsCountByBlogId", queryCommentsCountByBlogId);





// 获取最新评论
function queryNewComments(request, response) {
    commentDao.queryNewComments(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", result));
        response.end();
    });
}
path.set("/queryNewComments", queryNewComments);




module.exports.path = path;