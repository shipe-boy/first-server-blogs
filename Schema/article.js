//得到Schema对象
const {Schema} = require("../database/connect");

//声明 ObjectId
const ObjectId = Schema.Types.ObjectId;


//设置user的规范
const articleSchema = new Schema({
    title : String,  //文章标题
    tips : String,  //文章分类
    content : String, //文章内容
    author : {
        type : ObjectId,
        ref : "users" //关联的表
    },  //作者，存的不是用户名，而是对应的Id
    commentNum : Number
},{
    versionKey : false, //不存默认版本号
    timestamps : {
        createdAt : "createTime"  //存时间
    }
})

articleSchema.post("remove", (doc) => {

    const User = require("../module/user")
    const Comment = require("../module/comment")

    //取到作者id，和文章id
    const {author, _id:article} = doc

    //用户articleNum - 1
    User.findByIdAndUpdate(author, {$inc : {articleNum : -1}})

    //把当前文章所有相关的评论 - 1
   Comment.find({article : article})
          .then(data => {
              data.forEach(v => v.remove())
          })
})

//导出规范
module.exports = articleSchema;