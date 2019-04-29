//只做路由处理
const Router = require("koa-router")
const router = new Router;
const user = require("../control/user");//处理用户注册的post
const article = require("../control/article");//处理用户注册的post
const comment = require("../control/comment");//处理用户注册的post
const admin = require("../control/admin");//处理用户注册的post
const upload = require("../utils/upload");

//处理跟路由
router.get("/", user.keepLogin, article.getList
    /* async (ctx) =>{
        await ctx.render("index", {
            session : ctx.session
        })}; */
    /* await ctx.render("index" , {
        session: {
            avatar : "/avatar/img11.jpg"
        }
    }) */
)

//处理注册和登陆页面 
/* 
    /user/login
    /user/reg 
*/
router.get(/^\/user\/(reg|login)/, async (ctx) =>{
    const show = /(reg)$/.test(ctx.path)
    await ctx.render("register", {show})
})

//处理用户注册的post请求  /user/reg
router.post("/user/reg", user.reg);

//处理用户登陆的post请求    /user/login
router.post("/user/login", user.login);

//处理用户退出登录
router.get("/user/logout" , user.loginOut)

//点击跳转文章发表页面
router.get("/article", user.keepLogin, article.addPage)

//处理文章发表按钮点击后的路由
router.post("/article", user.keepLogin, article.add)

//处理文章列表
router.get("/page/:id", user.keepLogin, article.getList)

//文章详情页
router.get("/article/:id", user.keepLogin, article.details)

//提交评论
router.post("/comment", user.keepLogin, comment.publish)

//后台管理页面
router.get("/admin/:id", user.keepLogin, admin.index)

//头像上传
router.post("/upload", user.keepLogin, upload.single("file"), user.upload)

//获取对应用户的所有评论
router.get("/user/comments", user.keepLogin, comment.comList)
//删除对应评论
router.del("/comment/:id", user.keepLogin, comment.del)

//获取对应用户的所有文章
router.get("/user/articles", user.keepLogin, article.artList)
//删除对应文章
router.del("/article/:id", user.keepLogin, article.del)

//导出接口
module.exports = router;