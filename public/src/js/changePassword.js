'use strict';
let email='';
function resetPassword() {
    email=$('.resetPassword_text').val();
    $.ajax({
        url: `/resettingPassword?email=${email}`,
        type:'POST',
        success: function(res){
            if(res!=='fail'){
                alert('验证码已发送至您的邮箱，请注意查收');
                $('#resetPassword_frame').hide();
                $('#login_frame').show();
            }else {
                alert('该邮箱尚未被激活，请先注册激活！');
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
        alert('密码输入不一致,请重新输入');
        return;
    }
    $.ajax({
        url: `/resettingLogin?email=${email}`,
        type:'PUT',
        data:{
            passwordCode:passwordCode,
            password:password,
            passwordConfirmation:passwordConfirmation
        },
        success: function(res){
            alert('重置密码成功！');
            //以下代码没执行，不知道为什么发送了跳转请求没有跳转页面？？？
            $.ajax({
                url:'/',
                type:'GET',
                success:function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
}

