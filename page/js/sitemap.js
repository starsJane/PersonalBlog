var blogList = new Vue({
    el: "#blog_list",
    data: {
        blogList: []
    },
    computed: {

    },
    created: function () {
        // 查询所有的blog
        axios({
            method: "get",
            url: "/queryAllBlog"
        }).then(function (resp) {
            for (var i = 0 ; i < resp.data.data.length ; i ++) {
                // 给每一个数据对象添加一个link值用来跳转到文章详情页  "/blog_detail.html?bid=" + resp.data.data[i].id是文章详情页
                resp.data.data[i].link = "/blog_detail.html?bid=" + resp.data.data[i].id;
            }
            blogList.blogList = resp.data.data;
        });
    }
});