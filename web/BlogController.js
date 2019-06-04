// 博客文章
var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");

var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");

var path = new Map();


// 添加文章到数据库
function editBlog(request, response) {
    var params = url.parse(request.url, true).query;                 // {title:... , tags:...}
    var tags = params.tags.replace(/ /g, "").replace("，", ",");     // 把中文逗号替换成英文逗号
    request.on("data", function (data) {
        blogDao.insertBlog(params.title, data.toString(), tags, 0, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "添加成功", null));
            response.end();
            // 添加后把Blog表的tag标签也存到tags表
            var blogId = result.insertId;
            var tagList = tags.split(",");
            // console.log(tagList);   //例如输入qwe,ret, hgt后转化为[ 'qwe', 'ret', 'hgt' ]
            for (var i = 0 ; i < tagList.length ; i ++) {
                if (tagList[i] == "") {
                    continue;
                    // break：使用break可以退出当前的循环    下个循环不执行  for循环结束
                    // return：使用return可以结束整个函数    下个循环不执行  for循环结束
                    // continue：用于跳过当次循环        下个循环继续执行    for循环可以继续
                    // continue：if是一次性的代码，只要i的值等于""了，它就跳过接着执行for循环
                }
                queryTag(tagList[i], blogId);
            }
        });
    });
}
path.set("/editBlog", editBlog);

// 查询tags表是否存在tag标题，不存在就插入tag标题
function queryTag(tag, blogId) {
    tagsDao.queyrTag(tag, function (result) {           // result是查询的结果
        if (result == null || result.length == 0) {     // 没有一样的tag标题就插入tag标题
            insertTag(tag, blogId);
        } else {
            console.log(result);
            tagBlogMappingDao.insertTagBlogMapping(result[0].id, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {});
        }
    });
}
// 插入tag标题到tags表，并且把tagId和blogId插入到tag_blog_mapping
// 标题有，的话,是两个tagId对应一个blogId
function insertTag(tag, blogId) {
    tagsDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        insertTagBlogMapping(result.insertId, blogId);
    });
}
// 把tagId和blogId插入到tag_blog_mapping
function insertTagBlogMapping(tagId, blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {});
}




// 在数据库查找文章并展示在页面
function queryBlogByPage(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) { // parseInt取整一下
        for (var i = 0 ; i < result.length ; i ++) {
            result[i].content = result[i].content.replace(/<img[\w\W]*">/, "");     //把img标签里替换成空
            // 返回的时候把图片过滤掉
            // \w	匹配非特殊字符，即a-z、A-Z、0-9、_、汉字；   \W	匹配特殊字符，即非字母、非数字、非汉字、非_

            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, "");    //把标签替换成空
            result[i].content = result[i].content.substring(0, 300);    // 截取,限制输入300个字符
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}
path.set("/queryBlogByPage", queryBlogByPage);




// 分页功能——查找文章篇数
function queryBlogCount(request, response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}
path.set("/queryBlogCount", queryBlogCount);




// 查询详情页文章的id
function queryBlogById(request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogById(parseInt(params.bid), function(result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();

        // 每次请求并返回详情页文章数据后，对应id文章的浏览次数都要加1    刷新页面就可以看到了
        blogDao.addViews(parseInt(params.bid), function (result) {});
    });
}
path.set("/queryBlogById", queryBlogById);




// 地图页 查询获取所有要跳转的文章
function queryAllBlog(request, response) {
    blogDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}
path.set("/queryAllBlog", queryAllBlog);




// 获取最近热门文章
function queryHotBlog(request, response) {
    blogDao.queryHotBlog(5, function (result) {     // 第一个参数填展示几条
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}
path.set("/queryHotBlog", queryHotBlog);




module.exports.path = path;