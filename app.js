const Koa = require("koa")
const static = require("koa-static")//静态资源
const views = require("koa-views")//视图
const logger = require("koa-logger")//日志模块
const {join} = require("path")
const router = require("./routers/router")//路由
const body = require("koa-body")//解析post请求
const session = require("koa-session") //后台处理cookies

const app = new Koa;

app.keys = ["emmmmm"];

//配置session对象
const CONFIG = {
    key : "sessionID",
    maxAge : 1000*60*60,
    overwrite : true,
    httpOnly : true
    // signed : true
}

app
    .use(logger())//注册日志 中间件
    .use(session(CONFIG, app)) //注册session
    .use(body())//注册post解析数据中间件
    .use(static(join(__dirname, "public")))//设置静态资源根目录
    .use(views(join(__dirname, "views"), {
        extension: "pug" //使用的时pug模板
    }))//设置视图模板根目录


//注册路由信息
app
    .use(router.routes())
    .use(router.allowedMethods());

//监听端口
app.listen(3000, () =>{
    console.log("项目已经启动了哟")
})

{
    /*创建管理员用户 */
    // 管理员     admin
    // 密码       123

    const User = require("./module/user")
    const crypto = require("./utils/encrypt")

    User
        .find({username : "admin"})
        .then(data => {
            if(data.length === 0){//不存在，创建
                new User({
                    username : "admin",
                    password : crypto("123"),
                    role : 999,
                    commentNum : 0,
                    articleNum : 0
                }).save()
                  .then(data => {
                      console.log("创建成功")
                  }).catch(err => {
                        console.log("创建失败")
                  })
            }
        })
}