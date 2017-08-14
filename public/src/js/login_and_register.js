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
                //获取session中用户信息，在主页更新用户状态
            }else if(data==='wrong'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>密码错误！</div>')
            } else if (data==='inactivated') {
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>您已注册，请前往邮箱激活账号！</div>')
            }else if(data==='null'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>账号不存在，请注册后登陆！</div>')
            }
        });
    });
    //点击注册按钮，进行注册操作
    $('#register').click(function () {
        let email_register=$('#email').val();
        let password_register=$('#password').val();
        let password_conf=$('#password_conf').val();
        $.post('/send',{
            email:email_register,password:password_register,password_conf:password_conf
        },function (data) {
            if (data===true) {
                window.location.assign('/');
            }else if(data===false){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>账号已注册！</div>')
            }else if(data==='wrong_em'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>邮箱格式错误！</div>')
            }else if(data==="wrong_ps"){
                $('.flash_container').empty();
                $('.flash_container').append('<div class=alert>两次密码不一致！</div>')
            }
        });
    });
});
