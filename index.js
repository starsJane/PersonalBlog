// 路由接口

var express = require("express");
var globalConfig = require("./config");
var loader = require("./loader");

var app = new express();

// express默认找的静态页面是index.html
app.use(express.static("./page/"));


// 每日一句:   post向数据库添加(edit_every_day.html), get查询并展示在页面(../page/js/index.js)
app.post("/editEveryDay", loader.get("/editEveryDay"));
app.get("/queryEveryDay", loader.get("/queryEveryDay"));


// 博客文章:    post向数据库添加(edit_blog.html), get查询并展示在页面(../page/js/index.js)
app.post("/editBlog", loader.get("/editBlog"));
app.get("/queryBlogByPage", loader.get("/queryBlogByPage"));


// 分页：请求对应页面文章总数
app.get("/queryBlogCount", loader.get("/queryBlogCount"));


// 详情页文章：根据a标签跳转时传过来的blogId获取
app.get("/queryBlogById", loader.get("/queryBlogById"));


// 详情页发表评论
app.get("/addComment", loader.get("/addComment"));


// 获取验证码
app.get("/queryRandomCode", loader.get("/queryRandomCode"));


// 回复留言
// 获取回复留言
app.get("/queryCommentsByBlogId", loader.get("/queryCommentsByBlogId"));
// 获取留言数量 求总数
app.get("/queryCommentsCountByBlogId", loader.get("/queryCommentsCountByBlogId"));



// 地图页  获取所有要跳转的文章
app.get("/queryAllBlog", loader.get("/queryAllBlog"));

// 随机标签云
app.get("/queryRandomTags", loader.get("/queryRandomTags"));

// 最近热门
app.get("/queryHotBlog", loader.get("/queryHotBlog"));

// 最近评论
app.get("/queryNewComments", loader.get("/queryNewComments"));


// 点击随机云标签相应跳转      queryByTags获取有tag参数对应文章，queryByTagCount有tag参数对应文章分页总数
app.get("/queryByTag", loader.get("/queryByTag"));
app.get("/queryByTagCount", loader.get("/queryByTagCount"));




app.listen(globalConfig.port, function() {
    console.log("服务器已启动");
});


