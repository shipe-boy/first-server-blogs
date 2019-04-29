layui.use(['element', "layer"], function(){
  const layer = layui.layer
  const $ = layui.$

  let $username = $(".layui-show input[name=username]")
  let $password = $(".layui-show input[name=password]")
  let $password2 = $(".layui-show input[name=confirmPWD]")

  $password2.on("blur", function(){
    const pwd = $password.val()
    if($(this).val() !== pwd){
      layer.msg("两次密码不一致")
      $(this).val("")
    }
  })
});