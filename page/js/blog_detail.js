
// 获取详情页文章
var blogDetail = new Vue({
    el: "#blog_detail",
    data: {
        title: "",
        content: "",
        ctime: "",
        tags: "",
        views: ""
    },
    computed: {

    },
    created: function () {
        var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        // 当以get方式在url中传递了请求参数时，可以利用location的search属性提取参数的值
        // 设置或获取 网页地址跟在问号后面的部分
        console.log(searcheUrlParams);  // 例如：如果是这样bid=12&a=1，则打印["bid=6","a=1"]
        if (searcheUrlParams == "") {
            return;
        }
        var bid = -1;

        for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
            console.log(searcheUrlParams[i]);   // bid=12
            if (searcheUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searcheUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e);
                }
            }
        }

        axios({
            method: "get",
            url: "/queryBlogById?bid=" + bid
        }).then(function (resp) {
            console.log(resp);
            var result = resp.data.data[0];
            blogDetail.title = result.title;
            blogDetail.content = result.content;
            blogDetail.ctime = result.ctime;
            blogDetail.tags = result.tags;
            blogDetail.views = result.views;
        }).catch(function (resp) {
            console.log("请求失败");
        });
    }
});


// 获取文章评论
var sendComment = new Vue({
    el: "#send_comment",
    data: {
        vcode: "",
        rightCode: ""
    },
    computed: {

        // 获取验证码
        changeCode: function() {
            return function () {
                axios({
                    method: "get",
                    url: "/queryRandomCode"
                }).then(function (resp) {
                    console.log(resp);
                    sendComment.vcode = resp.data.data.data;
                    sendComment.rightCode = resp.data.data.text;
                });
            }
        },

        // 发送评论
        sendComment: function () {

            // 验证验证码是否正确, 错误则return，停止后续函数执行
            var code = document.getElementById("comment_code").value;
            if (code != sendComment.rightCode) {
                alert("验证码有误");
                return;
            }

            return function () {
                // 获取文章id，对哪一篇文章进行评论
                var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var bid = -10;
                for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
                    if (searcheUrlParams[i].split("=")[0] == "bid") {
                        try {
                            bid = parseInt(searcheUrlParams[i].split("=")[1]);
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }

                var reply = document.getElementById("comment_reply").value;
                var replyName = document.getElementById("comment_reply_name").value;
                var name = document.getElementById("comment_name").value;
                var email = document.getElementById("comment_email").value;
                var content = document.getElementById("comment_content").value;

                axios({
                    method: "get",
                    url: "/addComment?bid=" + bid + "&parent=" + reply + "&userName=" + name + "&email=" + email + "&content=" + content + "&parentName=" + replyName
                    // 如果是回复别人则reply为-1，不是回复别人则reply为正值
                }).then(function (resp) {
                    alert(resp.data.msg);
                });
            }
        }
    },

    created: function () {
        this.changeCode();
    }
});



// 获取回复留言（从评论里拿出数据来显示在回复留言区）
var blogComments = new Vue({
    el: "#blog_comments",
    data: {
        total: 0,
        comments: []
    },
    computed: {
        // 点击回复事件，改变发表评论的parent value为commentId，parentName vaule为userName
        reply: function() {
            return function (commentId, userName) {
                // 和上方发送评论联系
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName; //parent_name = userName
                location.href = "#send_comment";
            }
        }
    },
    created: function () {
        var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        var bid = -10;

        for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
            if (searcheUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searcheUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e);
                }
            }
        }

        // 获取留言内容
        axios({
            method: "get",
            url: "/queryCommentsByBlogId?bid=" + bid
        }).then(function(resp){

            blogComments.comments = resp.data.data;
            // console.log(blogComments.comments);
            // (6) [{…}, {…}, {…}, {…}, {…}, {…}, __ob__: Observer]
            // 0:
            // blog_id: 6
            // comments: "你好啊"
            // ctime: 1559223149
            // email: "123456@qq.com"
            // id: 1
            // parent: -1
            // parent_name: "0"
            // user_name: "panda"
            // utime: 1559223149


            // 回复他人
            for (var i = 0 ; i < blogComments.comments.length ; i ++) {
                if (blogComments.comments[i].parent > -1) {
                    blogComments.comments[i].options = "回复@" + blogComments.comments[i].parent_name;    // 回复@
                }
            }
        });

        // 获取留言总数
        axios({
            method: "get",
            url: "/queryCommentsCountByBlogId?bid=" + bid
        }).then(function (resp) {
            blogComments.total = resp.data.data[0].count;
        }).catch(function(resp) {
            console.log("请求错误");
        });
    }
});