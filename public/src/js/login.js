$(function () {
    //点击登陆按钮，进行登陆操作
    $('#login').click(function () {
        let email=$('#email').val();
        let password=$('#password').val();
        $.post('/login',{
            email:email,password:password
        },function (data) {
            if (data==='ok') {
                window.location.assign('/');
            } else if (data==='wrong_em') {
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">邮箱格式错误！</div>')
                hide();
            } else if (data === 'wrong_pw') {
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">密码错误！</div>')
                hide();
            } else if (data === 'inactivated') {
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">您已注册，请前往邮箱激活账号！</div>')
                hide();
            } else if (data === 'null') {
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>账号不存在，请注册后登陆！</div>')
                hide();
            }
        });
    });
});

function hide() {
    $('.alert').delay(2000).hide(0);
    }
