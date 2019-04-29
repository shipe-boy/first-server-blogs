//得到Schema对象
const {Schema} = require("../database/connect");

//设置user的规范
const userSchema = new Schema({
    username : String,
    password : String,
    avatar : {
        type : String,
        default : "/avatar/img1.jpg"
    },
    role : {
        type : Number,
        default : 1
    },
    commentNum : Number,
    articleNum : Number
},{versionKey : false})

//导出user规范
module.exports = userSchema;