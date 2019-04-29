const {db} = require("../database/connect"); //得到数据库的操控对象
const commentSchema = require("../Schema/comment"); //得到comment表数据的规范
const objComment = db.model("comments", commentSchema); //操控users表的对象

module.exports = objComment;