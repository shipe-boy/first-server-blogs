const User = require("../module/user");//操控集合的对象
const Comment = require("../module/comment")
const Article = require("../module/article")
const crypto = require("../utils/encrypt")//加密方法


//处理用户注册的中间件
exports.reg = async (ctx) => {
    // console.log("呜啦啦")
    let {username, password} = ctx.request.body;
    // console.log(username,password)
    // console.log(crypto(password))
    await new Promise((res, rej) => {
        User.find({username}, (err, data) => {
            //查询报错
            if(err) return rej(err); //

            //查询没报错，但是有同名数据
            if(data.length !== 0) return res("");

            //查询没报错，也没有同名数据
            const userobj = new User({
                username,
                password: crypto(password),
                commentNum : 0,
                articleNum : 0
            });
            userobj.save((err, data) =>{
                if(err){
                    rej('保存失败');
                }else{
                    res("保存成功");
                }
            });
        }) 
    }).then(async data =>{//成功
        if(data){//注册成功
            await ctx.render("isOk", {
                status : "regSuccess",
                url : "/user/login"
            })
        }else{//空字符串，用户名已存在
            await ctx.render("isOk", {
                status : "regFail",
                url : "/user/login"
            })
        }
    }, async err =>{//失败
        await ctx.render("isOk", {
            status : "regError",
            url : "/user/reg"
        })
    }) 
}

//用户登陆中间件
exports.login = async (ctx) => {
    let {username, password} = ctx.request.body;
    await new Promise((res, rej) => {
        User.find({username}, (err, data) => {
            //查询报错
            if(err) return rej(err); 

            //查询没报错，但是没有查到数据
            if(data.length === 0) return rej(0);

            //查询与之对应的用户名，比对密码是否一致
            if(data[0].password === crypto(password)){
                return res(data);
            }else{
                return res("") //密码不对
            }
            
        }) 
    }).then(async data =>{//成功
        if(data){//登陆成功
            await ctx.render("isOk", {
                status : "logSuccess",
                url : "/"
            })
            // console.log("登陆成功")
            //设置cookie
            ctx.cookies.set("username", username, {
                //配置cookie的属性
                domain : "127.0.0.1",
                path : "/",
                maxAge : 1000*60*60,
                httpOnly : true,//不让客户端控制这条cookie
                overwrite : false
            })
            ctx.cookies.set("userId", data[0]._id, {
                //配置cookie的属性
                domain : "127.0.0.1",
                path : "/",
                maxAge : 1000*60*60,
                httpOnly : true,//不让客户端控制这条cookie
                overwrite : false
            })

            //设置后台的session
            ctx.session = {
                username,
                userId : data[0]._id,
                avatar : data[0].avatar, //取到用户头像
                role : data[0].role
            }
        }else{//密码错误
            await ctx.render("isOk", {
                status : "logError",
                url : "/user/login"
            })
        }
    }, async err =>{//失败
        if(err === 0 ){ //用户名不存在
            await ctx.render("isOk", {
                status : "regNot",
                url : "/user/reg"
            })
        }else{//其他错误
            await ctx.render("isOk", {
                status : "regFail",
                url : "/user/login"
            })
        }
        
    }) 
}

//每次进入页面时确定用户状态
exports.keepLogin = async(ctx, next) =>{
    //判断session是否存在
    //console.log(ctx.session.isNew) //没有设置session时这条默认属性是true
    if(ctx.session.isNew){//后台没有设置session，可能从为登陆过，或者登陆过没有设session
        if(ctx.cookies.get("userId")){
            //登陆过，cookie有，但是session没有，更新session
            
            //再次登陆时更新头像
            let userId = ctx.cookies.get(data[0]._id);
            let avatar = await User.findById(userId)
                                    .then(data => data.avatar)
            
            ctx.session = {
                username : ctx.cookies.get(username),
                userId,
                avatar
                // userId : ctx.cookies.get(data[0]._id)
            }
        }
    }

    await next();
}

//退出登录
exports.loginOut = async (ctx) => {
    ctx.session = null;
    ctx.cookies.set("username", null, {
        maxAge : 0
    });
    ctx.cookies.set("userId", null, {
        maxAge : 0
    });
    //重定向，即跳转的网页
    ctx.redirect("/")
}


//头像上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename

    let data = {}

    await User.updateOne({_id : ctx.session.userId}, {$set : {avatar : "/avatar/" + filename}}, (err, res) => {
        if(err){
            data = {
                status : 0,
                message : "上传失败"
            }
        }else{
            data = {
                status : 1,
                message : "上传成功"
            }
        }
    })
    console.log(data)
    ctx.body = data
}
