//得到Schema对象
const {Schema} = require("../database/connect");

//声明 ObjectId
const ObjectId = Schema.Types.ObjectId;


//设置user的规范
const commentSchema = new Schema({
    content : String, //文章内容
    author : {
        type : ObjectId,
        ref : "users"
    },  //作者，存的不是用户名，而是对应的Id
    article : {
        type : ObjectId,
        ref : "articles"
    }
},{
    versionKey : false, //不存默认版本号
    timestamps : {
        createdAt : "createTime"  //存时间
    }
})

//设置comment 的 remove的钩子
//只能监听文档对象调用的及对象来调用，不可直接操作数据库，及只能监听new出来的对象，之后。原型上的方法
commentSchema.post("remove", (doc) => {
    //这个回调函数会在remove事件执行之前出发
    // console.log(doc);//操作的对象

    const Article = require("../module/article")
    const User = require("../module/user")

    const {author, article} = doc

    //对应文章的评论数减一
    Article.updateOne({_id : article}, {$inc : {commentNum: -1}}).exec()

    //当前被删除评论作者的comment - 1
    User.updateOne({_id : author}, {$inc : {commentNum: -1}}).exec()
})

//导出规范
module.exports = commentSchema;