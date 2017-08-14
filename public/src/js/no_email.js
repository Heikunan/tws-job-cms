$(function () {
    //点击发送验证邮件
    $('#resend').click(function () {
        let email=$('#email').val();
        $.post('/resend',{
            email:email
        },function (data) {
            if (data===true) {
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>邮件已发送，请前往邮箱验证！</div>');
            }else {
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>该账号尚未注册，请注册！</div>');
            }
        });
    });
});