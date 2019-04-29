const crypto = require("crypto"); //导入加密模块
 
module.exports = function(pwd, key = "emmmmm"){
    let hmac = crypto.createHmac("sha256", key);
    hmac.update(pwd);
    return hmac.digest("hex");//返回加密数据   规定是十六进制
}