var blogDao = require("../dao/BlogDao");
var tagsDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");

var path = new Map();


// 随机标签云  随机获取tag标题
function queryRandomTags(request, response) {
    tagsDao.queyrAllTag(function (result) {
        // 随机排  自定义排序   对获取到的数据随机打乱顺序
        // sort() 方法用于对数组的元素进行排序。
        result.sort(function () {
            return Math.random() > 0.5 ? true : false;
        });
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    });
}
path.set("/queryRandomTags", queryRandomTags);



// 随机标签云 点击标签获取有tag参数对应文章
function queryByTag(request, response) {
    var params = url.parse(request.url, true).query;

    // 根据url传过来的tag名拿到tag_id
    tagsDao.queyrTag(params.tag, function (result) {

        if (result == null || result.length == 0) {     // 如果没有该标签名
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        } else {
            // 按照tag_id拿到blog_id
            tagBlogMappingDao.queryByTag(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {

                var blogList = [];
                for (var i = 0 ; i < result.length ; i ++) {
                    // 根据blog_id拿到对应文章
                    blogDao.queryBlogById(result[i].blog_id, function (result) {
                        console.log(result[0]);
                        blogList.push(result[0]);
                    });
                }
                getResult(blogList, result.length, response);
            });
        }
    });
}
path.set("/queryByTag", queryByTag);



// 通过阻塞方式拿到所有信息，获取满了之后返回结果
function getResult(blogList, len, response) {

    if (blogList.length < len) {

        setTimeout(function () {
            getResult(blogList, len, response);
        }, 10);

    } else {
        for (var i = 0 ; i < blogList.length ; i ++) {
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*">/, "");
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g, "");
            blogList[i].content = blogList[i].content.substring(0, 300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", blogList));
        response.end();
    }
}



// 随机标签云 有tag参数分页总数   根据tagId获取符合条件的blogId总数
function queryByTagCount(request, response) {
    var params = url.parse(request.url, true).query;
    console.log(params.tag);
    tagsDao.queyrTag(params.tag, function (result) {    // 根据url传过来的tag名拿到tag_id
        console.log(result);
        tagBlogMappingDao.queryByTagCount(result[0].id, function (result) { // 按照tag_id拿到blog_id
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        });
    });
}
path.set("/queryByTagCount", queryByTagCount);




module.exports.path = path;
