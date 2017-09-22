$(function () {
    //点击发送验证邮件
    $('#resend').click(function () {
        let email=$('#email').val();
        $.post('/resend',{
            email:email
        },function (data) {
            if (data===true) {
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>邮件已发送，请前往邮箱验证！5秒后页面将跳转至首页！！</div>');
                window.setTimeout("window.location='/'",5000);
            }else if(data==='wrong'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>账号已注册，请前往首页登陆。5秒后页面将跳转至首页！！</div>');
                window.setTimeout("window.location='/'",5000);
            }
            else{
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>该账号尚未注册，请注册！</div>');
                hide();
            }
        });
    });
});

function hide() {
    $('.alert').delay(1000).hide(0);
};