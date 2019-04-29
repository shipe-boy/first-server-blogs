 //得到操控集合的对象
const Article = require("../module/article");
const User = require("../module/user")
const Comment = require("../module/comment")

//文章发表页
exports.addPage = async ctx => {
    await ctx.render("add-article", {
        session : ctx.session,
        title : "文章发表"
    })
}

//文章发表页中，点击发表，处理接收的数据
exports.add = async ctx => {
    //判断用户有没有登陆
    if(ctx.session.isNew) {
        return ctx.body = {
            status : 0,
            msg : "请登录"
        };
    }

    //取出发过来的数据
    let data = ctx.request.body;
    data.author = ctx.session.userId;
    data.commentNum = 0;


    await new Promise((res, rej) => {
        new Article(data)
            .save((err, data) => {
                if(err) return rej(err);
                res(data);
            })
    }).then(() => {

        //更新用户文章计数
        User.update({_id : data.author}, {$inc:{articleNum: 1}}, err => {
            if(err) return console.log(err)
        })
        
        ctx.body = {
            status : 1,
            msg : "发表成功"
        }

    }, () => {
        ctx.body = {
            status : 0,
            msg : "发表失败"
        }
    })
}


//文章列表
exports.getList = async (ctx) => {
    let page = ctx.params.id || 1;
    let maxNum = await Article.estimatedDocumentCount((err, data) => {
        if(err) return err;
        return data;
    });
    
    let artList = await Article
        .find()
        .sort("-createTime")
        .skip((page - 1) * 5) //数据库里从第几条开始找
        .limit(5)  //获取几条数据
        /* .populate({    //连表查询
            path : "author",
            select : "_id username avatar"
        }) */
        .populate("author", "_id username avatar") 
        .then((data) => data , (err) => {
            console.log("报错")
        });
        // console.log(ctx.session)

        
        //渲染页面
        await ctx.render("index", {
            session : ctx.session,
            title : "blog首页",
            artList,
            maxNum
        })
};

//获取文章详情页
exports.details = async (ctx) => {
    let _id = ctx.params.id;//文章id

    let article = await Article
        .findById(_id)
        .populate("author", "username")
        .then(data => data, err => err);

    //查找跟当前文章相关的所有评论
    let comment = await Comment
        .find({article : _id})
        .sort("-createTime")
        .populate("author", "username avatar")
        .then(data => data, err => {console.log("报错了")})
    
    //渲染页面
    await ctx.render("article", {
        session : ctx.session,
        title : article.title,
        article,
        comment
    })
}

//获取对用用户的所有文章
exports.artList = async (ctx) => {
    const userId = ctx.session.userId

    const data = await Article.find({author : userId})

    ctx.body = {
        code : 0,
        count : data.length,
        data
    }


}

//删除文章
exports.del = async (ctx) => {
    //文章id
    const _id = ctx.params.id;

    let res = {
        state : 1,
        message : "成功"
    }

    await Article.findById(_id)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state : 0,
                message : err
            }
        })

    ctx.body = res;
}