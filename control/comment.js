const Comment = require("../module/comment")
const Article = require("../module/article")
const User = require("../module/user")

//提交评论并保存
exports.publish = async (ctx) => {
    //判断用户是否登陆
    if(ctx.session.isNew){
        return ctx.body = {
            status : 0,
            msg : "请登录"
        }
    }

    //用户已经登陆
    //取出发过来的评论数据,发过来的只有文章id和评论内容，没有用户id，
    let data = ctx.request.body;
    //添加用户id存到数据库
    data.author = ctx.session.userId;
    
    //存数据库
    let objComments = new Comment(data);
    await objComments
        .save()
        .then(data => {//保存成功
            ctx.body = {
                status : 1,
                msg : "评论成功"
            }

            //更新文章评论计数器
            Article
                .update({_id : data.article}, {$inc : {commentNum : 1}})
                .then(data => data, err => err)

            //更新用户的评论计数器
            User
                .update({_id : data.author}, {$inc : {commentNum: 1}}, err => {
                    if(err) return console.log(err)
                })
        }, err => {
            ctx.body = {
                status : 0,
                msg : "评论失败"
            }
        })

}

//查询用户所有评论
exports.comList = async (ctx) => {
    
    const userId = ctx.session.userId

    const data = await Comment.find({author : userId}).populate("article", "title")
    // console.log(data)//data史提个数组包含同一个userid的所有评论
    /* [ { _id: 5c14f7d86e4c4f46e84d2e98,
        content: '2222222222',
        article: { _id: 5c126eabc137f734ece08f0e, title: 'aaaaaa' },
        author: 5c14f7c56e4c4f46e84d2e96,//////////////////////
        createTime: 2018-12-15T12:47:20.792Z,
        updatedAt: 2018-12-15T12:47:20.792Z },
      { _id: 5c14f7ee6e4c4f46e84d2e9a,
        content: '1111qqqqqqq',
        article: { _id: 5c14f7e56e4c4f46e84d2e99, title: 'qqqqqqqqqq' },
        author: 5c14f7c56e4c4f46e84d2e96,///////////////////////////
        createTime: 2018-12-15T12:47:42.674Z,
        updatedAt: 2018-12-15T12:47:42.674Z } ] */
    ctx.body = {
        code : 0,
        count : data.length,
        data
    }

}

//删除评论
exports.del = async (ctx) => {
    //评论id
    const commentId = ctx.params.id;

    let res = {
        state : 1,
        message : "成功"
    }

    await Comment.findById(commentId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state : 0,
                message : err
            }
        })

    ctx.body = res;
}