// 首页右侧随机标签云
var randomTags = new Vue({
    el: "#random_tags",
    data: {
        tags: []
    },
    // 随机颜色 和 随机字体大小 函数
    computed: {
        randomColor: function () {
            return function () {
                var red = Math.random() * 255;
                var green = Math.random() * 255;
                var blue = Math.random() * 255;
                return "rgb(" + red + ", " + green + ", " + blue + ")";
            }
        },
        randomSize: function () {
            return function () {
                var size = (Math.random() * 20 + 12) + "px";    // +12 防止出现很小的字
                return size;
            }
        }
    },

    // 获取文章标签
    created: function () {
        axios({
            method: "get",
            url: "/queryRandomTags"
        }).then(function (resp) {
            var result = [];
            for (var i = 0 ; i < resp.data.data.length ; i ++) {
                result.push( {text:resp.data.data[i].tag, link:"/?tag=" + resp.data.data[i].tag} );
            }
            randomTags.tags = result;
        });
    }
});


// 首页右侧最近热门
var newHot = new Vue({
    el: "#new_hot",
    data: {
        titleList: [

        ]
    },

    // 获取最近热门文章
    created: function () {
        axios({
            method: "get",
            url: "/queryHotBlog"
        }).then(function (resp) {
            var result = [];
            for (var i = 0 ; i < resp.data.data.length ; i ++) {
                var temp = {};
                temp.title = resp.data.data[i].title;
                // 详情页链接
                temp.link = "/blog_detail.html?bid=" + resp.data.data[i].id;
                result.push(temp);
            }
            newHot.titleList = result;
        });
    }
});

// 首页右侧最新评论
var newComments = new Vue({
    el: "#new_comments",
    data: {
        commentList: [

        ]
    },
    created: function () {
        axios({
            method: "get",
            url: "/queryNewComments"
        }).then(function (resp) {
            var result = [];
            for (var i = 0 ; i < resp.data.data.length ; i ++) {
                var temp = {};
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.comment = resp.data.data[i].comments;
                result.push(temp);
            }
            newComments.commentList = result;
        });
    }
});