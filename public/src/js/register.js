$(function () {
    //点击注册按钮，进行注册操作
    $('#register').click(function () {
        let email_register=$('#email').val();
        let password_register=$('#password').val();
        let password_conf=$('#password_conf').val();
        $.post('/send',{
            email:email_register,password:password_register,password_conf:password_conf
        },function (data) {
            if (data===true) {
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">注册成功，正在发送验证邮件，请前往邮箱激活账号。3秒后页面将跳转至首页！</div>')
                window.setTimeout("window.location='/'",3000);
            }else if(data===false){
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">账号已注册！</div>')
                hide();
            }else if(data==='wrong_em'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">邮箱格式错误！</div>')
                hide();
            }else if(data==="wrong_ps"){
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">两次密码不一致！</div>')
                hide();
            }
        });
    });
});


function hide() {
    $('.alert').delay(1000).hide(0);
};
