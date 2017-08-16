let email='';
function resetPassword() {
    email=$('.resetPassword_text').val();
    $.ajax({
        url: `/resettingPassword?email=${email}`,
        type:'POST',
        success: function(res){
            if(res!=='fail'){
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">验证码正发送至您的邮箱，请等待！</div>');
                hide();
                $('#resetPassword_frame').hide();
                $('#login_frame').show();
            }else {
                $('.flash_container').empty();
                $('.flash_container').append('<div class="alert">该邮箱尚未被激活，请先注册激活！</div>');
                hide();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function login() {
    let passwordCode=$('.login_text').val();
    let password=$('.login_password').val();
    let passwordConfirmation=$('.login_passwordConfirm').val();
    if(password!==passwordConfirmation){
        $('.flash_container').empty();
        $('.flash_container').append('<div class=alert>密码输入不一致,请重新输入！</div>');
        hide();
    }else {
        $.ajax({
            url: `/resettingLogin?email=${email}`,
            type: 'PUT',
            data: {
                passwordCode: passwordCode,
                password: password,
                passwordConfirmation: passwordConfirmation
            },
            success: function (reply) {
                console.log(reply);
                if (reply.affectedRows === 1) {
                    window.location.assign('/');
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

function hide() {
    $('.alert').delay(2000).hide(0);
}
