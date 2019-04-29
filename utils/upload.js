const multer = require("koa-multer")
const {join} = require("path")

const storage = multer.diskStorage({
    //存储位置
    destination : join(__dirname, "../public/avatar"),
    filename(req, file, cb){
        const arrFilename = file.originalname.split(".")
        cb(null, `${Date.now()}.${arrFilename[arrFilename.length - 1]}`)
    }
})

module.exports = multer({storage})