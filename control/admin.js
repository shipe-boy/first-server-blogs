const Article = require("../module/article")
const User = require("../module/user")
const Comment = require("../module/comment")
const fs = require("fs")
const {join} = require("path")

exports.index = async (ctx) => {
    //以防万一
    //用户没登录，提示请登录
    if (ctx.session.isNew) {
        //没登录
        ctx.status = 404;
        await ctx.render("404");
    }


    const id = ctx.params.id;//
    const arr = fs.readdirSync(join(__dirname, '../views/admin'))

    let bool = false;

    arr.forEach(v => {
        let name = v.replace(/^(admin\-)|(\.pug)$/g, "");
        if(name === id){
            bool = true;
            return;
        }
    })

    if(bool){
        // console.log(ctx.session)
        await ctx.render("./admin/admin-" + id,{
            role : ctx.session.role
        })
    }else{
        ctx.status = 404;
        await ctx.render("404");
    }


}