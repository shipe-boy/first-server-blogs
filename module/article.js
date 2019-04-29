const {db} = require("../database/connect")
const articleSchema = require("../Schema/article");
const objArticle = db.model("articles", articleSchema)

module.exports = objArticle;